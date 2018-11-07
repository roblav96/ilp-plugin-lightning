
// source maps for tsc files
import 'source-map-support/register'
import 'dotenv/config'



// need to be aware of all unprocessed errors
process.on('uncaughtException', error => console.error(`UNCAUGHT EXCEPTION ->`, error))
process.on('unhandledRejection', error => console.error(`UNHANDLED PROMISE REJECTION ->`, error))



// pretty console.log yay
const util = require('util')
Object.assign(util.inspect.defaultOptions, { depth: 4, showHidden: false, showProxy: true, compact: false, breakLength: Infinity, maxArrayLength: Infinity, sorted: true, colors: true })
Object.assign(util.inspect.styles, { string: 'green', regexp: 'green', date: 'green', number: 'magenta', boolean: 'blue', undefined: 'red', null: 'red', symbol: 'cyan', special: 'cyan' })

// import util from 'util'
// Object.assign(util.inspect.defaultOptions, { depth: 1, showHidden: false, showProxy: false, compact: false, breakLength: Infinity, maxArrayLength: Infinity, sorted: true, colors: true } as Partial<typeof util.inspect.defaultOptions>)
// Object.assign(util.inspect.styles, { string: 'green', regexp: 'green', date: 'green', number: 'magenta', boolean: 'blue', undefined: 'red', null: 'red', symbol: 'cyan', special: 'cyan' })



// chrome devtools are life cheat codes
declare global { interface Console { _stdout: tty.WriteStream } }
import tty from 'tty'
import inspector from 'inspector'
import exithook from 'exit-hook'
inspector.open(process.debugPort)
if (console._stdout.isTTY) {
	// dont clear my terminal brah! we only want to clear the devtools console
	console._stdout.isTTY = false
	console.clear()
	console._stdout.isTTY = true
}
exithook(() => inspector.close())



declare global {
	interface Console {
		/**▶ generate typescript declarations for input
		`console.log('____ ->', console.dtsgen(____))` */
		dtsgen(input: any): string
	}
}
import { generateIdentifierDeclarationFile } from 'dts-gen-v2'
Object.assign(console, {
	dtsgen(input) {
		if (input == null) return 'input == null';
		return generateIdentifierDeclarationFile('____', input).trim()
			.replace(/;/g, '').replace(/\015\n\015\n+/g, '\n').trim()
			.replace(/    /g, '\t').trim()
			.replace('declare const ____:', '').trim()
	},
} as Console)



// devtools debugger will disconnect if process not kept alive
setTimeout(function() { }, Date.now() / 1000)


