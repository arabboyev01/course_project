import bcrypt from 'bcrypt'

const HashingPassword = async function (password: string): Promise<string> {
    const saltRounds = 10
    return bcrypt.hashSync(password, saltRounds)
}

export { HashingPassword }