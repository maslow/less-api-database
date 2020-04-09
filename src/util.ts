


export function throwNotSupportErrorFunc(operator) {
    const func = () => {
        throw new Error(operator + ' not supported')
    }

    return func
}