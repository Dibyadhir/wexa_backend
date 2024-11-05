const mysql = require('../config/db.js')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const cloudinary = require('cloudinary')



cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

const register = (req, res) => {
    //console.log(req.body)
    const check = 'select * from user where email=?;'
    const values = [req.body.email]

    mysql.query(check, values, async (err, result) => {
        //terminal visible hai kya
        if (err) res.status(500).json(err.message)
        else {
            console.log(result)
            if (result.length === 0) {
                const hash = bcrypt.hashSync(req.body.password, 10)
                const insert = 'insert into user(first_name, last_name, email, password,pic,gender,dob, about_yourself ) values(?,?,?,?,"","","","")'
                const values = [req.body.firstName, req.body.lastName, req.body.email, hash]
                await mysql.promise().query(insert, values)

                res.send('user created succssfully')

            }
            else {
                res.status(406).send('Email address already exists')
            }
        }

    })

}

const login = (req, res) => {
    console.log(req.body)
    const { email, password } = req.body

    const check = 'select * from user where email=?;'
    const values = [email]

    mysql.query(check, values, async (err, result) => {
        //terminal visible hai kya
        if (err) res.status(500).json(err.message)
        else {
            console.log(result)
            if (result.length === 0) {
                res.status(500).json('Invalid Email/Password')
            }
            else {
                result = result[0]
                if (bcrypt.compareSync(password, result.password)) {
                    const data = { firstName: result.first_name, lastName: result.last_name, gender: result.gender, dob: result.dob, about: result.about_youself, profile: result.pic }
                    const token = jwt.sign(data, process.env.JWT_SECRET)
                    const activity = 'insert into activity_logs(user_id, activity_type, details) values(?,?,?)'
                    const act_val = [result.id, 'login', 'user logged in successfully']
                    await mysql.promise().query(activity, act_val)
                    res.send({ token: token, info: result.id })

                }
                else {
                    res.status(500).json('Invalid Email/Password')
                }

            }
        }
    })
}

const userLoginActivity = (req, res) => {
    const checkAct = 'select activity_time, first_name, last_name from activity_logs inner join user on activity_logs.user_id = user.id  where activity_type="login" and user_id=? order by activity_logs.id desc limit 1;'
    const checkVal = [req.body.userId]
    mysql.query(checkAct, checkVal, (err, result) => {
        if (err) res.status(500).json(err.message)
        else {
            console.log(result)
            res.send(result)
        }

    })

}

const userActivityLogs = (req, res) => {
    const checkAct = 'select activity_time, details from activity_logs where user_id=? order by activity_logs.id desc limit 100;'
    const checkVal = [req.body.userId]
    mysql.query(checkAct, checkVal, (err, result) => {
        if (err) res.status(500).json(err.message)
        else {
            console.log(result)
            res.send(result)
        }

    })

}

const getUser = (req, res) => {
    const q = 'select * from user where id=?'
    const v = [req.body.userId]
    mysql.query(q, v, (err, result) => {
        if (err) res.status(500).json(err.message)
        else {
            console.log(result)
            res.send(result[0])
        }

    })
}

const users = (req, res) => {
    console.log(req.body)
    const q = 'select first_name, last_name, pic, about_yourself from user where id !=? '
    const v = [req.body.userId]
    mysql.query(q, v, (err, result) => {
        if (err) res.status(500).json(err.message)
        else {
            console.log(result)
            res.send(result)
        }

    })

}

const updatepersonalinfo = (req, res) => {
    const { pic, first_name, last_name, dob, gender, email, about_yourself, id, } = req.body
    const check_query = 'select * from user where email = ? and id != ?'
    mysql.query(check_query, [email, id], async (err, check_res) => {
        if (err) {
            console.log(err)
            return res.status(500).json('error occured!')
        }
        else {
            console.log(check_res)
            if (check_res.length === 0) {
                try {
                    let profile_img = pic;
                    if (pic !== '') {
                        try {

                            const img_res = await cloudinary.uploader.upload(profile_img, { upload_preset: process.env.UPLOAD_PRESET_PROFILE_IMG })
                            //console.log(img_res)
                            profile_img = img_res.url
                            //console.log('working')
                        }
                        catch (err) {
                            console.log(err)
                            return res.status(500).json('something went wrong try again!')
                        }
                    }
                    //res.send('ok')

                    const update_query = 'update user set pic=?,first_name=?, last_name=?, dob=?,gender=?,about_yourself=? where id=?'
                    const update_values = [profile_img, first_name, last_name, dob, gender, about_yourself, id]
                    const activity = 'insert into activity_logs(user_id, activity_type, details) values(?,?,?)'
                    const act_val = [id, 'profile_update', 'profile updated successfully']


                    try {
                        await mysql.promise().query(activity, act_val)
                        await mysql.promise().query(update_query, update_values)

                        return res.status(201).json('user data updated successfully')
                    }
                    catch (err) {
                        console.log(err)
                        return res.status(500).json('error occured!')
                    }
                }
                catch (err) {
                    console.log(err)
                    return res.status(500).json('error occured')
                }

            }
            else {
                return res.status(500).json('email already exists!')
            }
        }
    })
}

module.exports = { register, login, userLoginActivity, userActivityLogs, getUser, updatepersonalinfo, users }




