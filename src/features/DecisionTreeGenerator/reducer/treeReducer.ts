export const treeReducerActionType = {
  AddChildren: "AddChildren",
};

export const addChildrenAction = (depth: number) => ({
  depth,
  type: treeReducerActionType.AddChildren,
});

const treeReducer = (state: any, action: any) => {
  switch (action.type) {
    case treeReducerActionType.AddChildren:
      return {
        ...state,
        children: [
          {
            attributes: {},
            name: "x",
          },
        ],
      };
    default:
      throw new Error();
  }
};

export default treeReducer;
