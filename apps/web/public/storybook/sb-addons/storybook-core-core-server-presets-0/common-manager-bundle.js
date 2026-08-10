try {
  (() => {
    var y = __STORYBOOK_API__,
      {
        ActiveTabs: k,
        Consumer: O,
        ManagerContext: S,
        Provider: h,
        RequestResponseError: w,
        addons: a,
        combineParameters: D,
        controlOrMetaKey: T,
        controlOrMetaSymbol: C,
        eventMatchesShortcut: U,
        eventToShortcut: A,
        experimental_MockUniversalStore: x,
        experimental_UniversalStore: P,
        experimental_requestResponse: M,
        experimental_useUniversalStore: R,
        isMacLike: B,
        isShortcutTaken: E,
        keyToSymbol: I,
        merge: K,
        mockChannel: N,
        optionOrAltSymbol: G,
        shortcutMatchesShortcut: L,
        shortcutToHumanString: Y,
        types: q,
        useAddonState: F,
        useArgTypes: H,
        useArgs: j,
        useChannel: V,
        useGlobalTypes: z,
        useGlobals: J,
        useParameter: Q,
        useSharedState: W,
        useStoryPrepared: X,
        useStorybookApi: Z,
        useStorybookState: $,
      } = __STORYBOOK_API__;
    var u = (() => {
        let e;
        return (
          typeof window < 'u'
            ? (e = window)
            : typeof globalThis < 'u'
              ? (e = globalThis)
              : typeof window < 'u'
                ? (e = window)
                : typeof self < 'u'
                  ? (e = self)
                  : (e = {}),
          e
        );
      })(),
      p = 'tag-filters',
      d = 'static-filter';
    a.register(p, (e) => {
      let i = Object.entries(u.TAGS_OPTIONS ?? {}).reduce((o, t) => {
        let [s, m] = t;
        return (m.excludeFromSidebar && (o[s] = !0), o);
      }, {});
      e.experimental_setFilter(d, (o) => {
        let t = o.tags ?? [];
        return (t.includes('dev') || o.type === 'docs') && t.filter((s) => i[s]).length === 0;
      });
    });
  })();
} catch (e) {
  console.error('[Storybook] One of your manager-entries failed: ' + import.meta.url, e);
}
