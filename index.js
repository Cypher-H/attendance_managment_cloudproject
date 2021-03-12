try {
    const express = require('express')
    const morgan = require('morgan')      
} catch (error) {
    console.error('Module Not Found Try Using npm install in terminal')
    return;
}


const app = express()
const port = 3000

app.use(morgan('dev'))

app.get('/',(req,res,next)=>{
    res.json({test: 'Hello World'})
})

app.listen(port, ()=>{
    console.log(`Server running at ${port}`)
})