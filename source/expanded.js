import { styler } from './index'

// expands CSS shorthand properties
// (e.g. `margin: 1px` -> `margin-left: 1px; ...`)
export default function(strings, ...values)
{
	return styler(strings, values, { expand: true })
}