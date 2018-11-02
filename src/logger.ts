
import 'source-map-support/register'
import _ from 'lodash'
import tty from 'tty'
import debug from 'debug'
import StackTracey from 'stacktracey'



const INTERCEPTS = ['log', 'error']

function proxy<T>(target: T, handler: (property: keyof T, args: any) => void): T {
	return new Proxy(target as any, {
		get(target, property, receiver) {
			let value = Reflect.get(target, property, receiver)
			if (!INTERCEPTS.includes(property as string) || !_.isFunction(value)) return value;
			return function(...args) {
				handler(property as any, args)
				return value.apply(this, args)
			}
		},
	})
}

let stdout = (global.console as any)._stdout as tty.WriteStream
stdout.destroy()

global.console = proxy(global.console, (property, args) => {
	let stack = new StackTracey()[2] as CallStack
	let namespace = stack.file.slice(0, -stack.fileRelative.length - 1).split('/').pop()
	let logger = debug(`${namespace}:${property}`) as (...args) => void
	logger(...args)
})



interface CallStack {
	beforeParse: string
	callee: string
	calleeShort: string
	column: number
	file: string
	fileName: string
	fileRelative: string
	fileShort: string
	index: boolean
	line: number
	native: boolean
	thirdParty: boolean
}

let stack = new StackTracey()[2]
console.log(`dtsgen -> stack ->`, console.dtsgen(stack))

setTimeout(() => { console.log(`StackTracey ->`); console.dir(StackTracey) }, 1000)


