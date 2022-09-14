import {expect} from "vitest";
import {getTreeNames, hasUniqueName, hasUniqueNameWithNewEntry} from "@/utils/getTreeNames";


describe('getTreeNames', () => {

    test("Tree With one Field", () => {
        const tree = {
            "attributes": {
                "depth": 0,
                "label": "Name",
                "type": "text",
                "isRoot": true,
                "isLeaf": true
            },
            "children": [],
            "name": "name"
        }

        const result = getTreeNames(tree)

        expect(result).toEqual(['name']);
    });

    test("Tree With multi Fields", () => {
        const tree = {
            "attributes": {
                "depth": 0,
                "label": "Name",
                "type": "text",
                "isRoot": true
            },
            "children": [
                {
                    "attributes": {
                        "depth": 1,
                        "label": "Age",
                        "type": "number"
                    },
                    "children": [
                        {
                            "attributes": {
                                "depth": 2,
                                "label": "Sexe",
                                "type": "select",
                                "values": [
                                    {
                                        "id": "0",
                                        "label": "Homme",
                                        "value": "male"
                                    },
                                    {
                                        "id": "1",
                                        "label": "Femme",
                                        "value": "female"
                                    }
                                ],
                                "isLeaf": true
                            },
                            "children": [],
                            "name": "gender"
                        }
                    ],
                    "name": "age"
                }
            ],
            "name": "name"
        }

        const result = getTreeNames(tree)

        expect(result).toEqual(['name', 'age', 'gender']);
    });

    test("Tree With value decision Fields", () => {
        const tree = {
            "attributes": {
                "depth": 0,
                "label": "Name",
                "type": "text",
                "isRoot": true
            },
            "children": [
                {
                    "attributes": {
                        "depth": 1,
                        "label": "Age",
                        "type": "number"
                    },
                    "children": [
                        {
                            "attributes": {
                                "depth": 2,
                                "label": "Matériels",
                                "type": "select",
                                "isDecision": true,
                                "isLeaf": false
                            },
                            "children": [
                                {
                                    "attributes": {
                                        "depth": 3,
                                        "label": "Mini-pelle",
                                        "value": "mini_excavator"
                                    },
                                    "children": [
                                        {
                                            "attributes": {
                                                "depth": 4,
                                                "label": "Type",
                                                "type": "select",
                                                "values": [
                                                    {
                                                        "id": "0",
                                                        "label": "Micro-Pelle 800kg",
                                                        "value": "mini_excavator_800_kg"
                                                    },
                                                    {
                                                        "id": "1",
                                                        "label": "Mini-Pelle 1,5T",
                                                        "value": "mini_excavator_1.5_t"
                                                    }
                                                ],
                                                "isLeaf": true
                                            },
                                            "children": [],
                                            "name": "mini_excavator_type"
                                        }
                                    ],
                                    "name": "materials:mini_excavator"
                                },
                                {
                                    "attributes": {
                                        "depth": 3,
                                        "label": "Nacelle",
                                        "value": "carrycot"
                                    },
                                    "children": [
                                        {
                                            "attributes": {
                                                "depth": 4,
                                                "label": "Type",
                                                "type": "select",
                                                "values": [
                                                    {
                                                        "id": "0",
                                                        "label": "Nacelle 8m",
                                                        "value": "carrycot_8"
                                                    },
                                                    {
                                                        "id": "1",
                                                        "label": "Nacelle 10m",
                                                        "value": "carrycot_10"
                                                    }
                                                ],
                                                "isLeaf": true
                                            },
                                            "children": [],
                                            "name": "carrycot_type"
                                        }
                                    ],
                                    "name": "materials:carrycot"
                                }
                            ],
                            "name": "materials"
                        }
                    ],
                    "name": "age"
                }
            ],
            "name": "name"
        }
        const result = getTreeNames(tree)

        expect(result).toEqual(['name', 'age', 'mini_excavator_type', 'carrycot_type', 'materials']);
    });

    test("Complexe Tree With multi value decision Fields", () => {
        const tree = {
            "attributes": {
                "depth": 0,
                "label": "Nom",
                "type": "text",
                "isRoot": true
            },
            "children": [
                {
                    "attributes": {
                        "depth": 1,
                        "label": "Matériels",
                        "type": "select",
                        "isDecision": true
                    },
                    "children": [
                        {
                            "attributes": {
                                "depth": 2,
                                "label": "Mini-pelle",
                                "value": "mini_excavator"
                            },
                            "children": [
                                {
                                    "attributes": {
                                        "depth": 3,
                                        "label": "Type",
                                        "type": "select",
                                        "values": [
                                            {
                                                "id": "0",
                                                "label": "Micro-Pelle 800kg",
                                                "value": "mini_excavator_800_kg"
                                            },
                                            {
                                                "id": "1",
                                                "label": "Micro-Pelle 1T",
                                                "value": "mini_excavator_1000_kg"
                                            }
                                        ],
                                        "isLeaf": true
                                    },
                                    "children": [],
                                    "name": "mini_excavator_type"
                                }
                            ],
                            "name": "materials:mini_excavator"
                        },
                        {
                            "attributes": {
                                "depth": 2,
                                "label": "Nacelle",
                                "value": "carrycot"
                            },
                            "children": [
                                {
                                    "attributes": {
                                        "depth": 3,
                                        "label": "Type",
                                        "type": "select",
                                        "isDecision": true
                                    },
                                    "children": [
                                        {
                                            "attributes": {
                                                "depth": 4,
                                                "label": "Nacelle 8m",
                                                "value": "carrycot_8",
                                                "isLeaf": true
                                            },
                                            "children": [],
                                            "name": "carrycot_type:carrycot_8"
                                        },
                                        {
                                            "attributes": {
                                                "depth": 4,
                                                "label": "Nacelle 10m",
                                                "value": "carrycot_10"
                                            },
                                            "children": [
                                                {
                                                    "attributes": {
                                                        "depth": 5,
                                                        "label": "Permission",
                                                        "type": "text",
                                                        "isLeaf": true
                                                    },
                                                    "children": [],
                                                    "name": "carrycot_10_permission"
                                                }
                                            ],
                                            "name": "carrycot_type:carrycot_10"
                                        },
                                        {
                                            "attributes": {
                                                "depth": 4,
                                                "label": "Nacelle 20m",
                                                "value": "carrycot_20"
                                            },
                                            "children": [
                                                {
                                                    "attributes": {
                                                        "depth": 5,
                                                        "label": "Permission",
                                                        "type": "text",
                                                        "isLeaf": true
                                                    },
                                                    "children": [],
                                                    "name": "carrycot_20_permission"
                                                }
                                            ],
                                            "name": "carrycot_type:carrycot_20"
                                        }
                                    ],
                                    "name": "carrycot_type"
                                }
                            ],
                            "name": "materials:carrycot"
                        }
                    ],
                    "name": "materials"
                }
            ],
            "name": "name"
        }
        const result = getTreeNames(tree)

        expect(result).toEqual([
            'name',
            'mini_excavator_type',
            'carrycot_10_permission',
            'carrycot_20_permission',
            'carrycot_type',
            'materials'
        ]);
    });

})

describe('hasUniqueName', () => {

    test("Array With unique name", () => {
        const array = ['name', 'age', 'gender']
        const result = hasUniqueName(array)
        expect(result).toEqual(true);
    });

    test("Array With duplicate name", () => {
        const array = ['name', 'age', 'gender', 'age']
        const result = hasUniqueName(array)
        expect(result).toEqual(false);
    });

    test("Array With multi duplicate name", () => {
        const array = ['name', 'age', 'gender', 'age', 'age']
        const result = hasUniqueName(array)
        expect(result).toEqual(false);
    });


})

describe('hasUniqueNameWithNewEntry', () => {

    test("add name no exist", () => {
        const array = ['name', 'age']
        const name = 'gender'
        const result = hasUniqueNameWithNewEntry(array, name)
        expect(result).toEqual(true);
    });

    test("add name no exist", () => {
        const array = ['name', 'age']
        const name = 'age'
        const result = hasUniqueNameWithNewEntry(array, name)
        expect(result).toEqual(false);
    });

})