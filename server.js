const express = require('express')
const morgan = require('morgan') 
const app = express()
const PORT = 3001

app.use(express.json())
app.use(morgan('tiny'))

morgan.token('object', function(req, res) {
    return `${JSON.stringify(req.body)}`
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :object' ))

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    {  
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/info', (req, res) => {
    const currentDate = new Date()
    res.send(`<h2>Phonebook has info for ${persons.length} people ,</h2>  <h2>${currentDate} </h2>`)
})

app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id   //the id variable is local to function its defined in
    const entry = persons.find(entry => entry.id == id)  //don't use === because it will cause misses for number vs string

    if(entry) {
        res.json(entry)
    }else{
        res.status(404).end() // this is a method that returns code 404 and ends the request.  res.send automatically ends the request
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)     //makes sure its a number so you don't have string issues.  the id variable is local to function
    persons = persons.filter(entry => entry.id != id)  //keeps persons that do not equal the id
    res.status(204).end()
})

const generateId = () => {
    const maxID = persons.length > 0
    ? Math.max( ...persons.map(n => n.id))
    :0
    return maxID +1
}

app.post('/api/persons', (req, res) => {
    const body = req.body

    if(!body.name){                  //if it doesn't have body.name
        return res.status(400).json({error: 'name is missing'})
    }

    if(!body.number)  {               //if it doesn't have body.number
        return res.status(400).json({error: 'number is missing'})
    }

    if(persons.some(entry => entry.name === body.name)){
        return res.status(409).json({error: 'name must be unique'})
    }

    let entry = {
        id: generateId(),
        name: body.name,
        number: body.number
    }


    persons = persons.push(entry)
    res.json(entry)
})

app.listen(PORT, () => {
    console.log(`The server is running on ${PORT}`)
})
