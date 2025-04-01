const {Pool} = require('pg')

module.exports = new Pool({
  connectionString: 'postgresql://nicolaslouis-kayen:Lukabuka7@localhost:5432/github_oauth'
})