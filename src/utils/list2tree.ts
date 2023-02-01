type IList = {
  id: number;
  parentId: number;
  children?: IList[] | null;
  sort: number;
  [prop: string]: any;
};
export const list2Tree = (list: IList[], root: number): IList[] | null => {
  const res = list
    .filter((item) => item.parentId === root)
    .map((item) => ({ ...item, children: list2Tree(list, item.id) }));
  return res.length === 0 ? null : res;
};

export const sortTree = (tree: IList[]) => {
  return tree.sort((pre, next) => {
    if (pre.children) {
      pre.children = sortTree(pre.children);
    }
    if (next.children) {
      next.children = sortTree(next.children);
    }
    return pre.sort - next.sort;
  });
};
