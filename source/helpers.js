// if the variable is defined
export const exists = what => typeof what !== 'undefined'

// if the string starts with the substring
export function starts_with(string, what)
{
	return string.indexOf(what) === 0
}

// if the string ends with the substring
export function ends_with(string, what)
{
	const index = string.lastIndexOf(what)
	if (index < 0)
	{
		return
	}
	return index === string.length - what.length
}

// repeat string N times
export function repeat(what, times)
{
	let result = ''
	while (times > 0)
	{
		result += what
		times--
	}
	return result
}

// if the text is blank
export function is_blank(text)
{
	return !text.replace(/\s/g, '')
}

// zips two arrays
export function zip(a, b)
{
	return a.map(function(_, index) 
	{
		return [a[index], b[index]]
	})
}

// extends the first object with 
export function extend(to, from, or_more)
{
	const parameters = Array.prototype.slice.call(arguments, 0)

	if (exists(or_more))
	{
		const last = parameters.pop()
		const intermediary_result = extend.apply(this, parameters)
		// pass undefined as the third argument because of either Babel.js bug, or some other bug
		// (the third argument is supplied and is equal to the second argument which is weird)
		return extend(intermediary_result, last, undefined)
	}

	for (let key of Object.keys(from))
	{
		if (typeof from[key] === 'object' && exists(to[key]))
		{
			to[key] = extend(to[key], from[key])
		}
		else
		{
			to[key] = from[key]
		}
	}

	return to
}