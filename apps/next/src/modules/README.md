# Modules

Modules are a collection of components that create sections or page-level objects within the user interface. Modules aim to prevent sibling imports of components that can over time allow for circular imports. Thus they are simply a composition of components.

Modules _can_ import other modules if necessary; however, this practice should be limited to avoid circular dependencies and confusion regarding their responsibilities and functionalities. Since Modules are a composition structure for Components they **should not** import from the `data-access/*` folder. Data access and business logic are functions pertaining to Features. As such, Modules will in most cases **not** include a suspense boundary due to a lack of asynchronous work such as `fetch` calls. However, you may include an error boundary if you want tighter control over the exception handling and presentation.

From an [atomic design](https://atomicdesign.bradfrost.com/chapter-2/) perspective, you can think of a module as anything that falls between an [organism](https://atomicdesign.bradfrost.com/chapter-2/#organisms) and a [template](https://atomicdesign.bradfrost.com/chapter-2/#templates).
