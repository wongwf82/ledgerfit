# LedgerFit

After first time clone run `yarn` to install dependencies for backend. Then, run `yarn client-install` to install dependencies for frontend.

### Development

#### Backend

`yarn start`

To migrate table
`./node_modules/.bin/sequelize db:migrate`

To seed table
`./node_modules/.bin/sequelize db:seed:all`

#### Frontend

`yarn client`

### Production

If push to heroku, all you need is just
`git push heroku master`

All backend & frontend dependencies install and build will be automatically run including table migration and table seeding.
