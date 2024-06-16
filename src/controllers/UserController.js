const createUserToken = require('../helpers/CreateUSerToken')
const User = require('../models/User')
const bcrypt = require('bcrypt')

module.exports = class UserController {
    static async register(req, res) {
        const { name, email, phone, password, confirmPassword } = req.body

        if (!name || !email || !phone || !password || !confirmPassword) {
            return res.status(422).json({ message: "Falta algum dado obrigatório!" })
        }

        if (password !== confirmPassword) {
            return res.status(422).json({ message: "As senhas não são compativeis!" })
        }

        const userExists = await User.findOne({ email: email })

        if (userExists) {
            return res.status(422).json({ message: "Este email ja esta sendo utilizado!" })
        }

        const salt = await bcrypt.genSalt(12)
        const passwordHash = await bcrypt.hash(password, salt)

        const user = new User({
            name,
            email,
            phone,
            password: passwordHash
        })

        try {
            const newUser = await user.save()

            await createUserToken(newUser, req, res)
        } catch (error) {
            return res.status(500).json({ message: "Internal Server Error!" })
        }
    }
}