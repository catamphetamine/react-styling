import styler, { is_pseudo_class, is_media_query } from './index'
import { is_object } from './helpers'

// for Radium it flattens the style class hierarchy:
// moves nested style classes to the top of the naming tree
// while prefixing them accordingly
// (except modifiers and media queries)
export default function(strings, ...values)
{
	const style = styler.apply(this, [strings].concat(values))

	move_up(style)

	return style
}

// moves child style classes to the surface of the style class tree
// prefixing them accordingly
function move_up(object, upside, new_name)
{
	let prefix

	if (upside)
	{
		upside[new_name] = object
		prefix = `${new_name}_`
	}
	else
	{
		upside = object
		prefix = ''
	}

	for (let key of Object.keys(object))
	{
		const child_object = object[key]

		if (is_object(child_object) && !is_pseudo_class(key) && !is_media_query(key))
		{
			delete object[key]
			move_up(child_object, upside, `${prefix}${key}`)
		}
	}
}