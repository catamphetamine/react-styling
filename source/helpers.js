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
	return !exists(text) || !text.replace(/\s/g, '')
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
/* istanbul ignore next: some weird transpiled code, not testable */
export function extend(...objects)
{
	const to   = objects[0]
	const from = objects[1]

	if (objects.length > 2)
	{
		const last = objects.pop()
		const intermediary_result = extend.apply(this, objects)
		return extend(intermediary_result, last)
	}

	// for loop requires Symbol (which requires Babel Polyfill)
	Object.keys(from).forEach(function(key)
	{
		if (typeof from[key] === 'object' && exists(to[key]))
		{
			to[key] = extend(to[key], from[key])
		}
		else
		{
			to[key] = from[key]
		}
	})

	return to
}