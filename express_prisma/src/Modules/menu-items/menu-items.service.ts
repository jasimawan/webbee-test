import App from "../../app";

interface MenuItem {
  id: number;
  name: string;
  url: string;
  parentId: number | null;
  createdAt: Date;
  children?: MenuItem[];
}
export class MenuItemsService {
  constructor(protected app: App) {}

  /* TODO: complete getMenuItems so that it returns a nested menu structure
    Requirements:
    - your code should result in EXACTLY one SQL query no matter the nesting level or the amount of menu items.
    - post process your results in javascript
    - it should work for infinite level of depth (children of childrens children of childrens children, ...)
    - verify your solution with `npm run test`
    - do a `git commit && git push` after you are done or when the time limit is over
    Hints:
    - open the `src/menu-items/menu-items.service.ts` file
    - partial or not working answers also get graded so make sure you commit what you have
    Sample response on GET /menu:
    ```json
    [
        {
            "id": 1,
            "name": "All events",
            "url": "/events",
            "parentId": null,
            "createdAt": "2021-04-27T15:35:15.000000Z",
            "children": [
                {
                    "id": 2,
                    "name": "Laracon",
                    "url": "/events/laracon",
                    "parentId": 1,
                    "createdAt": "2021-04-27T15:35:15.000000Z",
                    "children": [
                        {
                            "id": 3,
                            "name": "Illuminate your knowledge of the laravel code base",
                            "url": "/events/laracon/workshops/illuminate",
                            "parentId": 2,
                            "createdAt": "2021-04-27T15:35:15.000000Z",
                            "children": []
                        },
                        {
                            "id": 4,
                            "name": "The new Eloquent - load more with less",
                            "url": "/events/laracon/workshops/eloquent",
                            "parentId": 2,
                            "createdAt": "2021-04-27T15:35:15.000000Z",
                            "children": []
                        }
                    ]
                },
                {
                    "id": 5,
                    "name": "Reactcon",
                    "url": "/events/reactcon",
                    "parentId": 1,
                    "createdAt": "2021-04-27T15:35:15.000000Z",
                    "children": [
                        {
                            "id": 6,
                            "name": "#NoClass pure functional programming",
                            "url": "/events/reactcon/workshops/noclass",
                            "parentId": 5,
                            "createdAt": "2021-04-27T15:35:15.000000Z",
                            "children": []
                        },
                        {
                            "id": 7,
                            "name": "Navigating the function jungle",
                            "url": "/events/reactcon/workshops/jungle",
                            "parentId": 5,
                            "createdAt": "2021-04-27T15:35:15.000000Z",
                            "children": []
                        }
                    ]
                }
            ]
        }
    ]
  */

  async getMenuItems() {
    // Fetch all menu items from the database
    const menuItems = await this.app.getDataSource().menuItem.findMany();

    // Create a map of menu item IDs to their corresponding objects
    const menuItemsById = new Map<number, MenuItem>(
      menuItems.map((item) => [item.id, item])
    );

    // Group the menu items by their parent IDs
    const menuItemsByParentId = menuItems.reduce(
      (acc, item) => {
        if (!item.parentId) {
          // If the item has no parent, add it to the top level
          acc.topLevel.push(item);
        } else {
          // Otherwise, add it to its parent's children array
          const parent = menuItemsById.get(item.parentId) as MenuItem;
          if (!parent.children) {
            parent.children = [];
          }
          parent.children.push(item);
        }
        return acc;
      },
      { topLevel: [] } as { topLevel: MenuItem[] }
    );

    // Return the top-level menu items
    return menuItemsByParentId.topLevel;
  }
}
