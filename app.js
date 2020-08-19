require('dotenv').config()
const express = require('express')
const app = express()
const PORT = process.env.PORT
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

app.use(express.json())
app.use(bodyParser.json())
app.use(cors())
app.use(express.static('build'))

morgan.token('cont', function (req, res) { return JSON.stringify(req.body)})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :cont'))

const errorHandler = (error, req, res, next) => {
	if (error.name === 'CastError' && error.kind === 'ObjectId') {
		return res.status(400).send({ error: 'Malformed ID' })
	} else if (error.name === 'ValidationError') {
		return res.status(400).json({ error: error.message })
	}
	next(error)
}

app.use(errorHandler)

app.get('/api/persons', function(req, res) {
	Person.find({})
		.then(per => {
			res.json(per)
		})
		.catch(err => console.log(err))
})

app.get('/api/persons/:id', function(req, res, next) {

	Person.findById(req.params.id)
		.then(per => {
			if (per) {
				res.json(per)
			} else {
				res.send('User not found')
			}
		})
		.catch(err => next(err))

})

app.delete('/api/persons/:id', function(req, res, next) {
	Person.findByIdAndRemove(req.params.id)
		.then(() => res.status(204).end())
		.catch(err => next(err))

})

app.post('/api/persons', function(req, res, next) {

	if (!req.body.number) {
		return res.status(400).json({
			error: 'Number must be included'
		})
	}

	if (!req.body.name) {
		return res.status(400).json({
			error: 'Name must be included'
		})
	}

	const person = new Person({
		name: req.body.name,
		number: req.body.number
	})

	person.save()
		.then(x => x.toJSON())
		.then(saved => {
			res.json(saved)
		})
		.catch(err => next(err))
})

app.put('/api/persons/:id', (request, response, next) => {

	const person = {
		name: req.body.name,
		number: req.body.number,
	}

	Person.findByIdAndUpdate(request.params.id, person, { new: true })
		.then(newPer => {
			response.json(newPer)
		})
		.catch(error => next(err))
})
app.get('/info', function (req, res) {
	Person.countDocuments().then(amount => {
		res.send(
			`<p>Phonebook has info for ${amount} people</p><p>${new Date()}</p>`
		)
	})
})



app.listen(PORT, () => console.log(`Example app listening at http://localhost:${PORT}`))
