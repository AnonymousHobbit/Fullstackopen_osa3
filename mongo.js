const mongoose = require('mongoose')

if (process.argv.length < 3) {
	console.log('Password is required')
}

const password = process.argv[2]

const url =
  `mongodb+srv://fullstack:${password}@cluster0.6td5w.mongodb.net/test?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const perSchema = new mongoose.Schema({
	name: String,
	number: String,
})

const Person = mongoose.model('Person', perSchema)

if (process.argv.length === 3) {
	Person.find({})
		.then(res => {
			console.log('Phonebook:')

			res.forEach(person => {
				console.log(person.name, person.number)
			})
			mongoose.connection.close()
		})
		.catch(() => {
			console.log('Search failed')
			mongoose.connection.close()
		})
	return
}

const name = process.argv[3]
const number = process.argv[4]

const person = new Person({
	name: name,
	number: number
})

person.save().then(res => {
	console.log(`Added ${res.name} number ${res.number} to the phonebook`)
	mongoose.connection.close()
})
