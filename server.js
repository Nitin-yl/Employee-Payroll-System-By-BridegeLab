const express = require('express')
const fileHandler = require('./modules/fileHandler')

const app = express()
const PORT = 9000

app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.set('view engine', 'ejs')

// Log data on server start
;(async () => {
  const employees = await fileHandler.read()
  console.log("Employee Data:", employees)
})()

// Dashboard + Search
app.get('/', async (req, res) => {
  const employees = await fileHandler.read()
  const search = req.query.search || ""

  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(search.toLowerCase()) ||
    emp.department.toLowerCase().includes(search.toLowerCase())
  )

  res.render('index', {
    employees: filteredEmployees,
    search
  })
})

// Show Add Form
app.get('/add', (req, res) => {
  res.render('add')
})

// Add Employee
app.post('/add', async (req, res) => {
  const { name, department, salary } = req.body

  if (!name || !department || Number(salary) < 0) {
    return res.redirect('/')
  }

  const employees = await fileHandler.read()

  employees.push({
    id: Date.now(),
    name,
    department,
    salary: Number(salary)
  })

  await fileHandler.write(employees)
  res.redirect('/')
})

// Delete Employee
app.get('/delete/:id', async (req, res) => {
  const employees = await fileHandler.read()
  const updated = employees.filter(emp => emp.id != req.params.id)
  await fileHandler.write(updated)
  res.redirect('/')
})

// Show Edit Form
app.get('/edit/:id', async (req, res) => {
  const employees = await fileHandler.read()
  const employee = employees.find(emp => emp.id == req.params.id)
  res.render('edit', { employee })
})

// Update Employee
app.post('/edit/:id', async (req, res) => {
  const { name, department, salary } = req.body

  if (!name || !department || Number(salary) < 0) {
    return res.redirect('/')
  }

  const employees = await fileHandler.read()

  const updatedEmployees = employees.map(emp =>
    emp.id == req.params.id
      ? { ...emp, name, department, salary: Number(salary) }
      : emp
  )

  await fileHandler.write(updatedEmployees)
  res.redirect('/')
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
