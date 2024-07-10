const PORT=process.env.PORT ?? 8000
const express=require('express')
const app=express()
const pool=require('./db.js')
const {v4:uuidv4}=require('uuid')
const cors=require('cors')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
app.use(cors())
app.use(express.json())





//get all todos
app.get('/todos/:userEmail',async (req,res)=>{
    const {userEmail}=req.params
    console.log(userEmail)
    try {
        const {rows}=await pool.query('SELECT * FROM todos WHERE user_email=$1',[userEmail])
        res.send(rows)
        console.log(rows)
    } catch (error) {
        console.error(error)
    }
})

//create a new todo
app.post('/todos',async (req,res)=>{
    const {user_email,title,progress,date}=req.body;
    console.log('inside server: ',user_email,title,progress,date)
    const id=uuidv4()
    try {
        const newToDo=await pool.query(`INSERT INTO todos(id,user_email,title,progress,date) VALUES ($1,$2,$3,$4,$5);`,[id,user_email,title,progress,date])
        res.json()
    } catch (error) {
        console.error(error)
        
    }
})

//edit a todo
app.put('/todos/:id',async (req,res)=>{
    const {id}=req.params
    const {user_email,title,progress,date}=req.body
    console.log("inside server edit: ",user_email,title,progress,date,id)
    try {
    const editToDo=await pool.query(`UPDATE todos SET user_email=$1 , title=$2, progress=$3,date=$4 WHERE id=$5;`,[user_email,title,progress,date,id])
    // res.json(editToDo)
    res.send('ToDo updated')
        
    } catch (error) {
        console.log(error)
        
    }
})

//delete a todo
app.delete('/todos/:id',async (req,res)=>{
    const {id}=req.params
    try {
        const deleteToDo=await pool.query(`DELETE FROM todos WHERE id=$1`,[id])
        res.json(deleteToDo)
    } catch (error) {
        console.error(error)        
    }
})

//signup
app.post('/signup',async(req,res)=>{
    const {email,password}=req.body
    const salt=bcrypt.genSaltSync(10)
    const hashedPassword=bcrypt.hashSync(password,salt)
    const id=uuidv4()

    try {
       const signUp=await pool.query(`INSERT INTO users(email,hashed_password) VALUES ($1,$2)`,[email,hashedPassword])
        const token=jwt.sign({email},'secret',{expiresIn:'1hr'})
        res.json({email,token})
    } catch (error) {
        console.log(error)
        if(error){
            res.json({detail:error.detail})
        }
        
    }
    
})

app.post('/login',async (req,res)=>{
    const {email,password}=req.body
    try {
        const users = await pool.query(`SELECT * FROM users WHERE email=$1`,[email])        
        if(!users.rows.length){

            return res.json({detail:'invalid credentials'})
        }
            const success=await bcrypt.compare(password,users.rows[0].hashed_password)

            const token=jwt.sign({email},'secret',{expiresIn:'1hr'})

            if(success){
                res.json({'email':users.rows[0].email,token})
            }
            else{
                res.json({detail:'Login Failed'})
            }

    } catch (error) {
        console.log(error)
        
    }
    
})

//login
app.listen(PORT,()=>{console.log(`Server running on PORT ${PORT}`)})