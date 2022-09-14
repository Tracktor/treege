import type {TreeNode} from "@/features/DecisionTreeGenerator/type/TreeNode";

export const getTreeNames = (tree: { children: TreeNode['children'], name?: TreeNode['name'], attributes?: TreeNode['attributes'] }, attributeAccumulator: string[] = []): string[] => {
    // if juste first Element
    if (!tree.children.length && !attributeAccumulator.length && tree?.name) {
        return [tree.name];
    }

    // if last element
    if (!tree.children.length) {
        return attributeAccumulator;
    }

    // add first tree name
    if (tree.name) {
        attributeAccumulator = [...attributeAccumulator, tree.name];
    }


    const result = tree.children.map(({name, children}) => {
        // if More than on children (decision section)
        if (children.length > 1) {
            const results = children.map(val => getTreeNames({children: val.children}))
            const flattenResult = results.flat();

            return {names: [...attributeAccumulator, ...flattenResult, name], rest: {children: []}}
        }

        return {names: [...attributeAccumulator, name], rest: {children}}

    })[0];

    return getTreeNames(result.rest, result.names)
}

export const hasUniqueName = (array: string[]): boolean => {
    const uniqueName = new Set(array)
    return uniqueName.size === array.length;
}

export const hasUniqueNameWithNewEntry = (array: string[], name: string): boolean => {
    return hasUniqueName([...array, name])
}