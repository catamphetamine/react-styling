import
styler,
{
	flat,
	expanded
}
from '../index.es6'

describe(`exports`, function()
{
	it(`should export ES6`, function()
	{
		styler('')
		flat('')
		expanded('')
	})

	it(`should export CommonJS`, function()
	{
		const Library = require('../index.common')

		Library('')
		Library.flat('')
		Library.expanded('')

		// Legacy CommonJS exports
		require('../flat')('')
		require('../expanded')('')
	})
})