import * as Yup from 'yup'
import Category from '../models/Category'
import User from '../models/User'

class CategoryController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
    })

    try {
      await schema.validateSync(req.body, { abortEarly: false })
    } catch (err) {
      return res.status(400).json({ error: err.errors })
    }

    const { admin: isAdmin } = await User.findByPk(req.userId)

    if (!isAdmin) {
      res.status(401).json()
    }

    const { name } = req.body

    let path = null
    if (req.file) {
      path = req.file.filename
    }

    const categoryExists = await Category.findOne({
      where: {
        name,
      },
    })

    if (categoryExists) {
      res.status(400).json({ error: 'Category already exists!' })
    }

    const { id } = await Category.create({ name, path })
    res.json({ id, name })
  }

  async index(req, res) {
    const category = await Category.findAll()

    res.json(category)
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
    })

    try {
      await schema.validateSync(req.body, { abortEarly: false })
    } catch (err) {
      return res.status(400).json({ error: err.errors })
    }

    const { admin: isAdmin } = await User.findByPk(req.userId)

    if (!isAdmin) {
      res.status(401).json()
    }

    const { name } = req.body
    const { id } = req.params

    const categoryExists = await Category.findByPk(id)

    if (!categoryExists) {
      res.status(401).json({ error: 'Make sure your category id is correct!' })
    }

    let path = null
    if (req.file) {
      path = req.file.filename
    }

    await Category.update({ name, path }, { where: { id } })
    res.status(200).json({ id, name })
  }
}

export default new CategoryController()
