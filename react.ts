type Component = () => {
	render: () => void
	[key: string]: () => void
}

const React = (() => {
	const hooks: any = [] // because we stored every hook in array that is we can't use hooks conditionally or inside a function bacause if we do that then index would messup and your application would not work as exepected
	let idx = 0

	function render(component: Component) {
		const comp = component()
		comp.render()
		idx = 0
		return comp
	}

	function useState<T>(
		initVal: T
	): [T, (stateOrFunc: T | ((prev: T) => T)) => void] {
		let state = hooks[idx] ?? initVal
		hooks[idx] = state

		const _idx = idx // to remeber the respective index to change state
		function setState(stateOrFunc: T | ((prev: T) => T)) {
			state = stateOrFunc instanceof Function ? stateOrFunc(state) : stateOrFunc
			hooks[_idx] = state
		}

		idx++
		return [state, setState]
	}

	function useEffect<T>(cb: () => void, deps: T[]) {
		const oldDeps: T[] = hooks[idx]
		let hasChanged = false

		if (!oldDeps) hasChanged = true // effect runs for first time
		else if (oldDeps.some((dep, i) => !Object.is(dep, deps[i]))) {
			hasChanged = true // effect would runs whenever the deps changed
		}

		if (hasChanged) cb()

		hooks[idx] = deps
		idx++
	}

	return { useState, render, useEffect }
})()

const Component: Component = () => {
	const [counter, setCounter] = React.useState(1)
	const [dog, setDog] = React.useState("bulldog")

	React.useEffect(() => {
		console.log("COUNTER IS CHANGED", counter)
	}, [counter])

	return {
		render: () => console.log({ counter, dog }),
		increaseCounter: () => setCounter((prev) => prev + 1),
		changeDog: () => setDog(() => Math.random().toString()),
	}
}

var App = React.render(Component) // react rendering ui for the first time
App.increaseCounter() // updating state
var App = React.render(Component) // react re-rendering ui because state has changed
App.changeDog() // updating state
var App = React.render(Component) // react re-rendering ui because state has changed
App.changeDog() // updating state
var App = React.render(Component) // react re-rendering ui because state has changed
App.increaseCounter() // updating state
var App = React.render(Component) // react re-rendering ui because state has changed
App.increaseCounter() // updating state
App.changeDog() // updating state
var App = React.render(Component) // react re-rendering ui because state has changed
