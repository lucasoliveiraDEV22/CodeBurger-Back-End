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

    const { filename: path } = req.file

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

  catch(err) {
    console.log(err)
  }

  async index(req, res) {
    const category = await Category.findAll()

    res.json(category)
  }
}

export default new CategoryController()
