try {
  (() => {
    var a = __REACT__,
      {
        Children: le,
        Component: ie,
        Fragment: ue,
        Profiler: ce,
        PureComponent: pe,
        StrictMode: me,
        Suspense: de,
        __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: _e,
        cloneElement: be,
        createContext: Se,
        createElement: ve,
        createFactory: ye,
        createRef: fe,
        forwardRef: Oe,
        isValidElement: Te,
        lazy: Ce,
        memo: ge,
        startTransition: ke,
        unstable_act: Ie,
        useCallback: O,
        useContext: Ee,
        useDebugValue: xe,
        useDeferredValue: he,
        useEffect: E,
        useId: De,
        useImperativeHandle: we,
        useInsertionEffect: Ae,
        useLayoutEffect: Re,
        useMemo: Le,
        useReducer: Be,
        useRef: A,
        useState: R,
        useSyncExternalStore: Pe,
        useTransition: Me,
        version: Ne,
      } = __REACT__;
    var Fe = __STORYBOOK_API__,
      {
        ActiveTabs: Ge,
        Consumer: Ke,
        ManagerContext: Ye,
        Provider: $e,
        RequestResponseError: qe,
        addons: x,
        combineParameters: ze,
        controlOrMetaKey: je,
        controlOrMetaSymbol: Ze,
        eventMatchesShortcut: Je,
        eventToShortcut: Qe,
        experimental_MockUniversalStore: Xe,
        experimental_UniversalStore: et,
        experimental_requestResponse: tt,
        experimental_useUniversalStore: ot,
        isMacLike: rt,
        isShortcutTaken: nt,
        keyToSymbol: at,
        merge: st,
        mockChannel: lt,
        optionOrAltSymbol: it,
        shortcutMatchesShortcut: ut,
        shortcutToHumanString: ct,
        types: L,
        useAddonState: pt,
        useArgTypes: mt,
        useArgs: dt,
        useChannel: _t,
        useGlobalTypes: B,
        useGlobals: h,
        useParameter: bt,
        useSharedState: St,
        useStoryPrepared: vt,
        useStorybookApi: P,
        useStorybookState: yt,
      } = __STORYBOOK_API__;
    var gt = __STORYBOOK_COMPONENTS__,
      {
        A: kt,
        ActionBar: It,
        AddonPanel: Et,
        Badge: xt,
        Bar: ht,
        Blockquote: Dt,
        Button: wt,
        ClipboardCode: At,
        Code: Rt,
        DL: Lt,
        Div: Bt,
        DocumentWrapper: Pt,
        EmptyTabContent: Mt,
        ErrorFormatter: Nt,
        FlexBar: Ut,
        Form: Vt,
        H1: Ht,
        H2: Wt,
        H3: Ft,
        H4: Gt,
        H5: Kt,
        H6: Yt,
        HR: $t,
        IconButton: M,
        IconButtonSkeleton: qt,
        Icons: D,
        Img: zt,
        LI: jt,
        Link: Zt,
        ListItem: Jt,
        Loader: Qt,
        Modal: Xt,
        OL: eo,
        P: to,
        Placeholder: oo,
        Pre: ro,
        ProgressSpinner: no,
        ResetWrapper: ao,
        ScrollArea: so,
        Separator: N,
        Spaced: lo,
        Span: io,
        StorybookIcon: uo,
        StorybookLogo: co,
        Symbols: po,
        SyntaxHighlighter: mo,
        TT: _o,
        TabBar: bo,
        TabButton: So,
        TabWrapper: vo,
        Table: yo,
        Tabs: fo,
        TabsState: Oo,
        TooltipLinkList: U,
        TooltipMessage: To,
        TooltipNote: Co,
        UL: go,
        WithTooltip: V,
        WithTooltipPure: ko,
        Zoom: Io,
        codeCommon: Eo,
        components: xo,
        createCopyToClipboardFunction: ho,
        getStoryHref: Do,
        icons: wo,
        interleaveSeparators: Ao,
        nameSpaceClassNames: Ro,
        resetComponents: Lo,
        withReset: Bo,
      } = __STORYBOOK_COMPONENTS__;
    var G = { type: 'item', value: '' },
      K = (o, t) => ({
        ...t,
        name: t.name || o,
        description: t.description || o,
        toolbar: {
          ...t.toolbar,
          items: t.toolbar.items.map((e) => {
            let r = typeof e == 'string' ? { value: e, title: e } : e;
            return (
              r.type === 'reset' &&
                t.toolbar.icon &&
                ((r.icon = t.toolbar.icon), (r.hideIcon = !0)),
              { ...G, ...r }
            );
          }),
        },
      }),
      Y = ['reset'],
      $ = (o) => o.filter((t) => !Y.includes(t.type)).map((t) => t.value),
      b = 'addon-toolbars',
      q = async (o, t, e) => {
        (e &&
          e.next &&
          (await o.setAddonShortcut(b, {
            label: e.next.label,
            defaultShortcut: e.next.keys,
            actionName: `${t}:next`,
            action: e.next.action,
          })),
          e &&
            e.previous &&
            (await o.setAddonShortcut(b, {
              label: e.previous.label,
              defaultShortcut: e.previous.keys,
              actionName: `${t}:previous`,
              action: e.previous.action,
            })),
          e &&
            e.reset &&
            (await o.setAddonShortcut(b, {
              label: e.reset.label,
              defaultShortcut: e.reset.keys,
              actionName: `${t}:reset`,
              action: e.reset.action,
            })));
      },
      z = (o) => (t) => {
        let {
            id: e,
            toolbar: { items: r, shortcuts: n },
          } = t,
          c = P(),
          [S, i] = h(),
          s = A([]),
          u = S[e],
          T = O(() => {
            i({ [e]: '' });
          }, [i]),
          C = O(() => {
            let l = s.current,
              m = l.indexOf(u),
              d = m === l.length - 1 ? 0 : m + 1,
              p = s.current[d];
            i({ [e]: p });
          }, [s, u, i]),
          g = O(() => {
            let l = s.current,
              m = l.indexOf(u),
              d = m > -1 ? m : 0,
              p = d === 0 ? l.length - 1 : d - 1,
              _ = s.current[p];
            i({ [e]: _ });
          }, [s, u, i]);
        return (
          E(() => {
            n &&
              q(c, e, {
                next: { ...n.next, action: C },
                previous: { ...n.previous, action: g },
                reset: { ...n.reset, action: T },
              });
          }, [c, e, n, C, g, T]),
          E(() => {
            s.current = $(r);
          }, []),
          a.createElement(o, { cycleValues: s.current, ...t })
        );
      },
      H = ({ currentValue: o, items: t }) =>
        o != null && t.find((e) => e.value === o && e.type !== 'reset'),
      j = ({ currentValue: o, items: t }) => {
        let e = H({ currentValue: o, items: t });
        if (e) return e.icon;
      },
      Z = ({ currentValue: o, items: t }) => {
        let e = H({ currentValue: o, items: t });
        if (e) return e.title;
      },
      J = ({ active: o, disabled: t, title: e, icon: r, description: n, onClick: c }) =>
        a.createElement(
          M,
          { active: o, title: n, disabled: t, onClick: t ? () => {} : c },
          r && a.createElement(D, { icon: r, __suppressDeprecationWarning: !0 }),
          e ? `\xA0${e}` : null,
        ),
      Q = ({
        right: o,
        title: t,
        value: e,
        icon: r,
        hideIcon: n,
        onClick: c,
        disabled: S,
        currentValue: i,
      }) => {
        let s =
            r &&
            a.createElement(D, {
              style: { opacity: 1 },
              icon: r,
              __suppressDeprecationWarning: !0,
            }),
          u = { id: e ?? '_reset', active: i === e, right: o, title: t, disabled: S, onClick: c };
        return (r && !n && (u.icon = s), u);
      },
      X = z(
        ({
          id: o,
          name: t,
          description: e,
          toolbar: { icon: r, items: n, title: c, preventDynamicIcon: S, dynamicTitle: i },
        }) => {
          let [s, u, T] = h(),
            [C, g] = R(!1),
            l = s[o],
            m = !!l,
            d = o in T,
            p = r,
            _ = c;
          (S || (p = j({ currentValue: l, items: n }) || p),
            i && (_ = Z({ currentValue: l, items: n }) || _),
            !_ && !p && console.warn(`Toolbar '${t}' has no title or icon`));
          let W = O(
            (I) => {
              u({ [o]: I });
            },
            [o, u],
          );
          return a.createElement(
            V,
            {
              placement: 'top',
              tooltip: ({ onHide: I }) => {
                let F = n
                  .filter(({ type: k }) => {
                    let w = !0;
                    return (k === 'reset' && !l && (w = !1), w);
                  })
                  .map((k) =>
                    Q({
                      ...k,
                      currentValue: l,
                      disabled: d,
                      onClick: () => {
                        (W(k.value), I());
                      },
                    }),
                  );
                return a.createElement(U, { links: F });
              },
              closeOnOutsideClick: !0,
              onVisibleChange: g,
            },
            a.createElement(J, {
              active: C || m,
              disabled: d,
              description: e || '',
              icon: p,
              title: _ || '',
            }),
          );
        },
      ),
      ee = () => {
        let o = B(),
          t = Object.keys(o).filter((e) => !!o[e].toolbar);
        return t.length
          ? a.createElement(
              a.Fragment,
              null,
              a.createElement(N, null),
              t.map((e) => {
                let r = K(e, o[e]);
                return a.createElement(X, { key: e, id: e, ...r });
              }),
            )
          : null;
      };
    x.register(b, () =>
      x.add(b, {
        title: b,
        type: L.TOOL,
        match: ({ tabId: o }) => !o,
        render: () => a.createElement(ee, null),
      }),
    );
  })();
} catch (e) {
  console.error('[Storybook] One of your manager-entries failed: ' + import.meta.url, e);
}
