const { Model, Category, Tag, User, ModelFile, Review } = require('../models');
const path = require('path');
const fs = require('fs');  

module.exports = {
  getAllModels: async (req, res) => {
    try {
      const { page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;

      const { count, rows: models } = await Model.findAndCountAll({
        attributes: [
          'id', 
          'name', 
          'slug', 
          'price', 
          'preview_image',
          'model_file_url',
          'is_featured',
          'created_at'
        ],
        include: [
          { 
            model: Category, 
            attributes: ['id', 'name', 'slug'],
            through: { attributes: [] } 
          },
          { 
            model: Tag, 
            attributes: ['id', 'name', 'slug'],
            through: { attributes: [] }
          }
        ],
        limit: parseInt(limit),
        offset: offset,
        order: [['created_at', 'DESC']]
      });

      res.json({
        total: count,
        page: parseInt(page),
        pages: Math.ceil(count / limit),
        models
      });
    } catch (error) {
      console.error('Error in getAllModels:', error);
      res.status(500).json({ 
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  getModelBySlug: async (req, res) => {
    try {
      const model = await Model.findOne({
        where: { slug: req.params.slug },
        include: [
          { 
            model: User, 
            as: 'creator', 
            attributes: ['id', 'username', 'telegram_id'] 
          },
          { 
            model: ModelFile,
            as: 'files',
            attributes: ['id', 'file_url', 'file_type', 'file_format'] 
          },
          { 
            model: Review,
            include: [{
              model: User,
              attributes: ['id', 'username']
            }]
          },
          {
            model: Category,
            attributes: ['id', 'name', 'slug']
          }
        ]
      });
      
      if (!model) {
        return res.status(404).json({ 
          error: 'Model not found',
          slug: req.params.slug
        });
      }
      
      await model.increment('view_count', { by: 1 });
      
      const response = {
        ...model.get({ plain: true }),
        model_data: {
          url: model.model_file_url,
          preview: model.preview_image,
        }
      };
      
      res.json(response);
    } catch (error) {
      console.error('Error in getModelBySlug:', error);
      res.status(500).json({ 
        error: 'Failed to fetch model',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  createModel: async (req, res) => {
    try {
      // Валидация обязательных полей (без model_file_url)
      if (!req.body.name || !req.body.price) {
        return res.status(400).json({ 
          error: 'Name and price are required' 
        });
      }

      const modelData = {
        name: req.body.name,
        description: req.body.description || null,
        price: req.body.price,
        polygon_count: req.body.polygon_count || null,
        file_size: null, // Будет обновлено при загрузке файла
        is_featured: req.body.is_featured || false,
        creator_id: req.body.creator_id,
        slug: generateSlug(req.body.name),
        preview_image: req.body.preview_image || null,
        model_file_url: null, // Будет обновлено при загрузке файла
        model_format: null   // Будет обновлено при загрузке файла
      };

      const model = await Model.create(modelData);
      
      if (req.body.categories && req.body.categories.length > 0) {
        await model.addCategories(req.body.categories);
      }
      
      if (req.body.tags && req.body.tags.length > 0) {
        await model.addTags(req.body.tags);
      }
      
      res.status(201).json({
        success: true,
        model: {
          id: model.id,
          slug: model.slug,
          name: model.name,
          price: model.price,
          preview_image: model.preview_image
          // Не включаем model_file_url, так как его еще нет
        }
      });
    } catch (error) {
      console.error('Error in createModel:', error);
      
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({ 
          error: 'Model with this name or slug already exists' 
        });
      }
      
      res.status(500).json({ 
        error: 'Failed to create model',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  uploadModel: async (req, res) => {
  try {
    // Проверка загруженного файла
    if (!req.file) {
      return res.status(400).json({
        error: 'Файл не загружен',
        details: 'Убедитесь, что: 1) Отправляете файл в поле "model" 2) Формат .glb/.gltf/.obj/.fbx 3) Размер < 100MB'
      });
    }

    const model = await Model.findByPk(req.params.id);
    if (!model) {
      return res.status(404).json({ error: 'Модель не найдена' });
    }

    // Создаем папку, если ее нет
    const uploadDir = path.join(__dirname, '../uploads/models');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Формируем путь (универсально для Windows/Linux)
    const filePath = path.join('uploads', 'models', req.file.filename)
      .replace(/\\/g, '/'); // Заменяем обратные слеши

    // Обновляем модель
    await model.update({
      model_file_url: `/${filePath}`,
      model_format: path.extname(req.file.originalname).slice(1),
      file_size: req.file.size
    });

    res.json({
      success: true,
      message: '3D модель успешно загружена',
      file: {
        originalname: req.file.originalname,
        filename: req.file.filename,
        size: req.file.size,
        url: `/${filePath}` // URL для доступа к файлу
      }
    });

  } catch (error) {
    console.error('Ошибка загрузки:', error);
    
    // Специфичные ошибки Multer
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({ error: 'Файл слишком большой (макс. 100MB)' });
    }
    if (error.message.includes('Неподдерживаемый формат')) {
      return res.status(415).json({ error: error.message });
    }

    res.status(500).json({
      error: 'Ошибка при загрузке модели',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
};

function generateSlug(name) {
  return name.toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, '');
}