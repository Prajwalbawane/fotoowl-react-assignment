try {
  (() => {
    var me = Object.create;
    var J = Object.defineProperty;
    var he = Object.getOwnPropertyDescriptor;
    var fe = Object.getOwnPropertyNames;
    var ge = Object.getPrototypeOf,
      we = Object.prototype.hasOwnProperty;
    var A = ((e) =>
      typeof require < 'u'
        ? require
        : typeof Proxy < 'u'
          ? new Proxy(e, { get: (t, a) => (typeof require < 'u' ? require : t)[a] })
          : e)(function (e) {
      if (typeof require < 'u') return require.apply(this, arguments);
      throw Error('Dynamic require of "' + e + '" is not supported');
    });
    var U = (e, t) => () => (e && (t = e((e = 0))), t);
    var be = (e, t) => () => (t || e((t = { exports: {} }).exports, t), t.exports);
    var ye = (e, t, a, c) => {
      if ((t && typeof t == 'object') || typeof t == 'function')
        for (let s of fe(t))
          !we.call(e, s) &&
            s !== a &&
            J(e, s, { get: () => t[s], enumerable: !(c = he(t, s)) || c.enumerable });
      return e;
    };
    var ve = (e, t, a) => (
      (a = e != null ? me(ge(e)) : {}),
      ye(t || !e || !e.__esModule ? J(a, 'default', { value: e, enumerable: !0 }) : a, e)
    );
    var f = U(() => {});
    var g = U(() => {});
    var w = U(() => {});
    var le = be((se, Z) => {
      f();
      g();
      w();
      (function (e) {
        if (typeof se == 'object' && typeof Z < 'u') Z.exports = e();
        else if (typeof define == 'function' && define.amd) define([], e);
        else {
          var t;
          (typeof window < 'u' || typeof window < 'u'
            ? (t = window)
            : typeof self < 'u'
              ? (t = self)
              : (t = this),
            (t.memoizerific = e()));
        }
      })(function () {
        var e, t, a;
        return (function c(s, b, d) {
          function o(n, I) {
            if (!b[n]) {
              if (!s[n]) {
                var r = typeof A == 'function' && A;
                if (!I && r) return r(n, !0);
                if (i) return i(n, !0);
                var u = new Error("Cannot find module '" + n + "'");
                throw ((u.code = 'MODULE_NOT_FOUND'), u);
              }
              var p = (b[n] = { exports: {} });
              s[n][0].call(
                p.exports,
                function (h) {
                  var y = s[n][1][h];
                  return o(y || h);
                },
                p,
                p.exports,
                c,
                s,
                b,
                d,
              );
            }
            return b[n].exports;
          }
          for (var i = typeof A == 'function' && A, m = 0; m < d.length; m++) o(d[m]);
          return o;
        })(
          {
            1: [
              function (c, s, b) {
                s.exports = function (d) {
                  if (typeof Map != 'function' || d) {
                    var o = c('./similar');
                    return new o();
                  } else return new Map();
                };
              },
              { './similar': 2 },
            ],
            2: [
              function (c, s, b) {
                function d() {
                  return ((this.list = []), (this.lastItem = void 0), (this.size = 0), this);
                }
                ((d.prototype.get = function (o) {
                  var i;
                  if (this.lastItem && this.isEqual(this.lastItem.key, o)) return this.lastItem.val;
                  if (((i = this.indexOf(o)), i >= 0))
                    return ((this.lastItem = this.list[i]), this.list[i].val);
                }),
                  (d.prototype.set = function (o, i) {
                    var m;
                    return this.lastItem && this.isEqual(this.lastItem.key, o)
                      ? ((this.lastItem.val = i), this)
                      : ((m = this.indexOf(o)),
                        m >= 0
                          ? ((this.lastItem = this.list[m]), (this.list[m].val = i), this)
                          : ((this.lastItem = { key: o, val: i }),
                            this.list.push(this.lastItem),
                            this.size++,
                            this));
                  }),
                  (d.prototype.delete = function (o) {
                    var i;
                    if (
                      (this.lastItem &&
                        this.isEqual(this.lastItem.key, o) &&
                        (this.lastItem = void 0),
                      (i = this.indexOf(o)),
                      i >= 0)
                    )
                      return (this.size--, this.list.splice(i, 1)[0]);
                  }),
                  (d.prototype.has = function (o) {
                    var i;
                    return this.lastItem && this.isEqual(this.lastItem.key, o)
                      ? !0
                      : ((i = this.indexOf(o)), i >= 0 ? ((this.lastItem = this.list[i]), !0) : !1);
                  }),
                  (d.prototype.forEach = function (o, i) {
                    var m;
                    for (m = 0; m < this.size; m++)
                      o.call(i || this, this.list[m].val, this.list[m].key, this);
                  }),
                  (d.prototype.indexOf = function (o) {
                    var i;
                    for (i = 0; i < this.size; i++) if (this.isEqual(this.list[i].key, o)) return i;
                    return -1;
                  }),
                  (d.prototype.isEqual = function (o, i) {
                    return o === i || (o !== o && i !== i);
                  }),
                  (s.exports = d));
              },
              {},
            ],
            3: [
              function (c, s, b) {
                var d = c('map-or-similar');
                s.exports = function (n) {
                  var I = new d(!1),
                    r = [];
                  return function (u) {
                    var p = function () {
                      var h = I,
                        y,
                        E,
                        v = arguments.length - 1,
                        P = Array(v + 1),
                        T = !0,
                        C;
                      if ((p.numArgs || p.numArgs === 0) && p.numArgs !== v + 1)
                        throw new Error(
                          'Memoizerific functions should always be called with the same number of arguments',
                        );
                      for (C = 0; C < v; C++) {
                        if (((P[C] = { cacheItem: h, arg: arguments[C] }), h.has(arguments[C]))) {
                          h = h.get(arguments[C]);
                          continue;
                        }
                        ((T = !1), (y = new d(!1)), h.set(arguments[C], y), (h = y));
                      }
                      return (
                        T && (h.has(arguments[v]) ? (E = h.get(arguments[v])) : (T = !1)),
                        T || ((E = u.apply(null, arguments)), h.set(arguments[v], E)),
                        n > 0 &&
                          ((P[v] = { cacheItem: h, arg: arguments[v] }),
                          T ? o(r, P) : r.push(P),
                          r.length > n && i(r.shift())),
                        (p.wasMemoized = T),
                        (p.numArgs = v + 1),
                        E
                      );
                    };
                    return ((p.limit = n), (p.wasMemoized = !1), (p.cache = I), (p.lru = r), p);
                  };
                };
                function o(n, I) {
                  var r = n.length,
                    u = I.length,
                    p,
                    h,
                    y;
                  for (h = 0; h < r; h++) {
                    for (p = !0, y = 0; y < u; y++)
                      if (!m(n[h][y].arg, I[y].arg)) {
                        p = !1;
                        break;
                      }
                    if (p) break;
                  }
                  n.push(n.splice(h, 1)[0]);
                }
                function i(n) {
                  var I = n.length,
                    r = n[I - 1],
                    u,
                    p;
                  for (
                    r.cacheItem.delete(r.arg), p = I - 2;
                    p >= 0 && ((r = n[p]), (u = r.cacheItem.get(r.arg)), !u || !u.size);
                    p--
                  )
                    r.cacheItem.delete(r.arg);
                }
                function m(n, I) {
                  return n === I || (n !== n && I !== I);
                }
              },
              { 'map-or-similar': 1 },
            ],
          },
          {},
          [3],
        )(3);
      });
    });
    f();
    g();
    w();
    f();
    g();
    w();
    f();
    g();
    w();
    f();
    g();
    w();
    var l = __REACT__,
      {
        Children: $e,
        Component: Je,
        Fragment: M,
        Profiler: Qe,
        PureComponent: Xe,
        StrictMode: et,
        Suspense: tt,
        __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: ot,
        cloneElement: nt,
        createContext: rt,
        createElement: N,
        createFactory: it,
        createRef: at,
        forwardRef: st,
        isValidElement: lt,
        lazy: ct,
        memo: Q,
        startTransition: ut,
        unstable_act: pt,
        useCallback: X,
        useContext: dt,
        useDebugValue: It,
        useDeferredValue: mt,
        useEffect: x,
        useId: ht,
        useImperativeHandle: ft,
        useInsertionEffect: gt,
        useLayoutEffect: wt,
        useMemo: bt,
        useReducer: yt,
        useRef: ee,
        useState: z,
        useSyncExternalStore: vt,
        useTransition: St,
        version: Ct,
      } = __REACT__;
    f();
    g();
    w();
    var Et = __STORYBOOK_API__,
      {
        ActiveTabs: Tt,
        Consumer: Rt,
        ManagerContext: At,
        Provider: xt,
        RequestResponseError: Lt,
        addons: H,
        combineParameters: Bt,
        controlOrMetaKey: Dt,
        controlOrMetaSymbol: Pt,
        eventMatchesShortcut: Mt,
        eventToShortcut: Vt,
        experimental_MockUniversalStore: Ut,
        experimental_UniversalStore: Nt,
        experimental_requestResponse: zt,
        experimental_useUniversalStore: Ht,
        isMacLike: Gt,
        isShortcutTaken: Ft,
        keyToSymbol: qt,
        merge: Wt,
        mockChannel: Yt,
        optionOrAltSymbol: jt,
        shortcutMatchesShortcut: Kt,
        shortcutToHumanString: Zt,
        types: te,
        useAddonState: $t,
        useArgTypes: Jt,
        useArgs: Qt,
        useChannel: Xt,
        useGlobalTypes: eo,
        useGlobals: G,
        useParameter: F,
        useSharedState: to,
        useStoryPrepared: oo,
        useStorybookApi: oe,
        useStorybookState: no,
      } = __STORYBOOK_API__;
    f();
    g();
    w();
    var lo = __STORYBOOK_COMPONENTS__,
      {
        A: co,
        ActionBar: uo,
        AddonPanel: po,
        Badge: Io,
        Bar: mo,
        Blockquote: ho,
        Button: fo,
        ClipboardCode: go,
        Code: wo,
        DL: bo,
        Div: yo,
        DocumentWrapper: vo,
        EmptyTabContent: So,
        ErrorFormatter: Co,
        FlexBar: _o,
        Form: ko,
        H1: Oo,
        H2: Eo,
        H3: To,
        H4: Ro,
        H5: Ao,
        H6: xo,
        HR: Lo,
        IconButton: L,
        IconButtonSkeleton: Bo,
        Icons: Do,
        Img: Po,
        LI: Mo,
        Link: Vo,
        ListItem: Uo,
        Loader: No,
        Modal: zo,
        OL: Ho,
        P: Go,
        Placeholder: Fo,
        Pre: qo,
        ProgressSpinner: Wo,
        ResetWrapper: Yo,
        ScrollArea: jo,
        Separator: Ko,
        Spaced: Zo,
        Span: $o,
        StorybookIcon: Jo,
        StorybookLogo: Qo,
        Symbols: Xo,
        SyntaxHighlighter: en,
        TT: tn,
        TabBar: on,
        TabButton: nn,
        TabWrapper: rn,
        Table: an,
        Tabs: sn,
        TabsState: ln,
        TooltipLinkList: q,
        TooltipMessage: cn,
        TooltipNote: un,
        UL: pn,
        WithTooltip: W,
        WithTooltipPure: dn,
        Zoom: In,
        codeCommon: mn,
        components: hn,
        createCopyToClipboardFunction: fn,
        getStoryHref: gn,
        icons: wn,
        interleaveSeparators: bn,
        nameSpaceClassNames: yn,
        resetComponents: vn,
        withReset: Sn,
      } = __STORYBOOK_COMPONENTS__;
    f();
    g();
    w();
    var En = __STORYBOOK_THEMING__,
      {
        CacheProvider: Tn,
        ClassNames: Rn,
        Global: Y,
        ThemeProvider: An,
        background: xn,
        color: Ln,
        convert: Bn,
        create: Dn,
        createCache: Pn,
        createGlobal: Mn,
        createReset: Vn,
        css: Un,
        darken: Nn,
        ensure: zn,
        ignoreSsrWarning: Hn,
        isPropValid: Gn,
        jsx: Fn,
        keyframes: qn,
        lighten: Wn,
        styled: S,
        themes: Yn,
        typography: jn,
        useTheme: Kn,
        withTheme: Zn,
      } = __STORYBOOK_THEMING__;
    f();
    g();
    w();
    var er = __STORYBOOK_ICONS__,
      {
        AccessibilityAltIcon: tr,
        AccessibilityIcon: or,
        AccessibilityIgnoredIcon: nr,
        AddIcon: rr,
        AdminIcon: ir,
        AlertAltIcon: ar,
        AlertIcon: sr,
        AlignLeftIcon: lr,
        AlignRightIcon: cr,
        AppleIcon: ur,
        ArrowBottomLeftIcon: pr,
        ArrowBottomRightIcon: dr,
        ArrowDownIcon: Ir,
        ArrowLeftIcon: mr,
        ArrowRightIcon: hr,
        ArrowSolidDownIcon: fr,
        ArrowSolidLeftIcon: gr,
        ArrowSolidRightIcon: wr,
        ArrowSolidUpIcon: br,
        ArrowTopLeftIcon: yr,
        ArrowTopRightIcon: vr,
        ArrowUpIcon: Sr,
        AzureDevOpsIcon: Cr,
        BackIcon: _r,
        BasketIcon: kr,
        BatchAcceptIcon: Or,
        BatchDenyIcon: Er,
        BeakerIcon: Tr,
        BellIcon: Rr,
        BitbucketIcon: Ar,
        BoldIcon: xr,
        BookIcon: Lr,
        BookmarkHollowIcon: Br,
        BookmarkIcon: Dr,
        BottomBarIcon: Pr,
        BottomBarToggleIcon: Mr,
        BoxIcon: Vr,
        BranchIcon: Ur,
        BrowserIcon: ne,
        ButtonIcon: Nr,
        CPUIcon: zr,
        CalendarIcon: Hr,
        CameraIcon: Gr,
        CameraStabilizeIcon: Fr,
        CategoryIcon: qr,
        CertificateIcon: Wr,
        ChangedIcon: Yr,
        ChatIcon: jr,
        CheckIcon: Kr,
        ChevronDownIcon: Zr,
        ChevronLeftIcon: $r,
        ChevronRightIcon: Jr,
        ChevronSmallDownIcon: Qr,
        ChevronSmallLeftIcon: Xr,
        ChevronSmallRightIcon: ei,
        ChevronSmallUpIcon: ti,
        ChevronUpIcon: oi,
        ChromaticIcon: ni,
        ChromeIcon: ri,
        CircleHollowIcon: ii,
        CircleIcon: ai,
        ClearIcon: si,
        CloseAltIcon: li,
        CloseIcon: ci,
        CloudHollowIcon: ui,
        CloudIcon: pi,
        CogIcon: di,
        CollapseIcon: Ii,
        CommandIcon: mi,
        CommentAddIcon: hi,
        CommentIcon: fi,
        CommentsIcon: gi,
        CommitIcon: wi,
        CompassIcon: bi,
        ComponentDrivenIcon: yi,
        ComponentIcon: vi,
        ContrastIcon: Si,
        ContrastIgnoredIcon: Ci,
        ControlsIcon: _i,
        CopyIcon: ki,
        CreditIcon: Oi,
        CrossIcon: Ei,
        DashboardIcon: Ti,
        DatabaseIcon: Ri,
        DeleteIcon: Ai,
        DiamondIcon: xi,
        DirectionIcon: Li,
        DiscordIcon: Bi,
        DocChartIcon: Di,
        DocListIcon: Pi,
        DocumentIcon: Mi,
        DownloadIcon: Vi,
        DragIcon: Ui,
        EditIcon: Ni,
        EllipsisIcon: zi,
        EmailIcon: Hi,
        ExpandAltIcon: Gi,
        ExpandIcon: Fi,
        EyeCloseIcon: qi,
        EyeIcon: Wi,
        FaceHappyIcon: Yi,
        FaceNeutralIcon: ji,
        FaceSadIcon: Ki,
        FacebookIcon: Zi,
        FailedIcon: $i,
        FastForwardIcon: Ji,
        FigmaIcon: Qi,
        FilterIcon: Xi,
        FlagIcon: ea,
        FolderIcon: ta,
        FormIcon: oa,
        GDriveIcon: na,
        GithubIcon: ra,
        GitlabIcon: ia,
        GlobeIcon: aa,
        GoogleIcon: sa,
        GraphBarIcon: la,
        GraphLineIcon: ca,
        GraphqlIcon: ua,
        GridAltIcon: pa,
        GridIcon: da,
        GrowIcon: j,
        HeartHollowIcon: Ia,
        HeartIcon: ma,
        HomeIcon: ha,
        HourglassIcon: fa,
        InfoIcon: ga,
        ItalicIcon: wa,
        JumpToIcon: ba,
        KeyIcon: ya,
        LightningIcon: va,
        LightningOffIcon: Sa,
        LinkBrokenIcon: Ca,
        LinkIcon: _a,
        LinkedinIcon: ka,
        LinuxIcon: Oa,
        ListOrderedIcon: Ea,
        ListUnorderedIcon: Ta,
        LocationIcon: Ra,
        LockIcon: Aa,
        MarkdownIcon: xa,
        MarkupIcon: La,
        MediumIcon: Ba,
        MemoryIcon: Da,
        MenuIcon: Pa,
        MergeIcon: Ma,
        MirrorIcon: Va,
        MobileIcon: re,
        MoonIcon: Ua,
        NutIcon: Na,
        OutboxIcon: za,
        OutlineIcon: Ha,
        PaintBrushIcon: Ga,
        PaperClipIcon: Fa,
        ParagraphIcon: qa,
        PassedIcon: Wa,
        PhoneIcon: Ya,
        PhotoDragIcon: ja,
        PhotoIcon: Ka,
        PhotoStabilizeIcon: Za,
        PinAltIcon: $a,
        PinIcon: Ja,
        PlayAllHollowIcon: Qa,
        PlayBackIcon: Xa,
        PlayHollowIcon: es,
        PlayIcon: ts,
        PlayNextIcon: os,
        PlusIcon: ns,
        PointerDefaultIcon: rs,
        PointerHandIcon: is,
        PowerIcon: as,
        PrintIcon: ss,
        ProceedIcon: ls,
        ProfileIcon: cs,
        PullRequestIcon: us,
        QuestionIcon: ps,
        RSSIcon: ds,
        RedirectIcon: Is,
        ReduxIcon: ms,
        RefreshIcon: ie,
        ReplyIcon: hs,
        RepoIcon: fs,
        RequestChangeIcon: gs,
        RewindIcon: ws,
        RulerIcon: bs,
        SaveIcon: ys,
        SearchIcon: vs,
        ShareAltIcon: Ss,
        ShareIcon: Cs,
        ShieldIcon: _s,
        SideBySideIcon: ks,
        SidebarAltIcon: Os,
        SidebarAltToggleIcon: Es,
        SidebarIcon: Ts,
        SidebarToggleIcon: Rs,
        SpeakerIcon: As,
        StackedIcon: xs,
        StarHollowIcon: Ls,
        StarIcon: Bs,
        StatusFailIcon: Ds,
        StatusIcon: Ps,
        StatusPassIcon: Ms,
        StatusWarnIcon: Vs,
        StickerIcon: Us,
        StopAltHollowIcon: Ns,
        StopAltIcon: zs,
        StopIcon: Hs,
        StorybookIcon: Gs,
        StructureIcon: Fs,
        SubtractIcon: qs,
        SunIcon: Ws,
        SupportIcon: Ys,
        SweepIcon: js,
        SwitchAltIcon: Ks,
        SyncIcon: Zs,
        TabletIcon: ae,
        ThumbsUpIcon: $s,
        TimeIcon: Js,
        TimerIcon: Qs,
        TransferIcon: K,
        TrashIcon: Xs,
        TwitterIcon: el,
        TypeIcon: tl,
        UbuntuIcon: ol,
        UndoIcon: nl,
        UnfoldIcon: rl,
        UnlockIcon: il,
        UnpinIcon: al,
        UploadIcon: sl,
        UserAddIcon: ll,
        UserAltIcon: cl,
        UserIcon: ul,
        UsersIcon: pl,
        VSCodeIcon: dl,
        VerifiedIcon: Il,
        VideoIcon: ml,
        WandIcon: hl,
        WatchIcon: fl,
        WindowsIcon: gl,
        WrenchIcon: wl,
        XIcon: bl,
        YoutubeIcon: yl,
        ZoomIcon: vl,
        ZoomOutIcon: Sl,
        ZoomResetIcon: Cl,
        iconList: _l,
      } = __STORYBOOK_ICONS__;
    var $ = ve(le()),
      B = 'storybook/viewport',
      R = 'viewport',
      pe = {
        mobile1: {
          name: 'Small mobile',
          styles: { height: '568px', width: '320px' },
          type: 'mobile',
        },
        mobile2: {
          name: 'Large mobile',
          styles: { height: '896px', width: '414px' },
          type: 'mobile',
        },
        tablet: { name: 'Tablet', styles: { height: '1112px', width: '834px' }, type: 'tablet' },
      },
      D = { name: 'Reset viewport', styles: { height: '100%', width: '100%' }, type: 'desktop' },
      Ce = { [R]: { value: void 0, isRotated: !1 } },
      _e = { viewport: 'reset', viewportRotated: !1 },
      ke = globalThis.FEATURES?.viewportStoryGlobals ? Ce : _e,
      de = (e, t) => e.indexOf(t),
      Oe = (e, t) => {
        let a = de(e, t);
        return a === e.length - 1 ? e[0] : e[a + 1];
      },
      Ee = (e, t) => {
        let a = de(e, t);
        return a < 1 ? e[e.length - 1] : e[a - 1];
      },
      Ie = async (e, t, a, c) => {
        (await e.setAddonShortcut(B, {
          label: 'Previous viewport',
          defaultShortcut: ['alt', 'shift', 'V'],
          actionName: 'previous',
          action: () => {
            a({ viewport: Ee(c, t) });
          },
        }),
          await e.setAddonShortcut(B, {
            label: 'Next viewport',
            defaultShortcut: ['alt', 'V'],
            actionName: 'next',
            action: () => {
              a({ viewport: Oe(c, t) });
            },
          }),
          await e.setAddonShortcut(B, {
            label: 'Reset viewport',
            defaultShortcut: ['alt', 'control', 'V'],
            actionName: 'reset',
            action: () => {
              a(ke);
            },
          }));
      },
      Te = S.div({ display: 'inline-flex', alignItems: 'center' }),
      ce = S.div(({ theme: e }) => ({
        display: 'inline-block',
        textDecoration: 'none',
        padding: 10,
        fontWeight: e.typography.weight.bold,
        fontSize: e.typography.size.s2 - 1,
        lineHeight: '1',
        height: 40,
        border: 'none',
        borderTop: '3px solid transparent',
        borderBottom: '3px solid transparent',
        background: 'transparent',
      })),
      Re = S(L)(() => ({ display: 'inline-flex', alignItems: 'center' })),
      Ae = S.div(({ theme: e }) => ({ fontSize: e.typography.size.s2 - 1, marginLeft: 10 })),
      xe = {
        desktop: l.createElement(ne, null),
        mobile: l.createElement(re, null),
        tablet: l.createElement(ae, null),
        other: l.createElement(M, null),
      },
      Le = ({ api: e }) => {
        let t = F(R),
          [a, c, s] = G(),
          [b, d] = z(!1),
          { options: o = pe, disable: i } = t || {},
          m = a?.[R] || {},
          n = m.value,
          I = m.isRotated,
          r = o[n] || D,
          u = b || r !== D,
          p = R in s,
          h = Object.keys(o).length;
        if (
          (x(() => {
            Ie(e, n, c, Object.keys(o));
          }, [o, n, c, e]),
          r.styles === null || !o || h < 1)
        )
          return null;
        if (typeof r.styles == 'function')
          return (
            console.warn(
              'Addon Viewport no longer supports dynamic styles using a function, use css calc() instead',
            ),
            null
          );
        let y = I ? r.styles.height : r.styles.width,
          E = I ? r.styles.width : r.styles.height;
        return i
          ? null
          : l.createElement(Be, {
              item: r,
              updateGlobals: c,
              viewportMap: o,
              viewportName: n,
              isRotated: I,
              setIsTooltipVisible: d,
              isLocked: p,
              isActive: u,
              width: y,
              height: E,
            });
      },
      Be = l.memo(function (e) {
        let {
            item: t,
            viewportMap: a,
            viewportName: c,
            isRotated: s,
            updateGlobals: b,
            setIsTooltipVisible: d,
            isLocked: o,
            isActive: i,
            width: m,
            height: n,
          } = e,
          I = X((r) => b({ [R]: r }), [b]);
        return l.createElement(
          M,
          null,
          l.createElement(
            W,
            {
              placement: 'bottom',
              tooltip: ({ onHide: r }) =>
                l.createElement(q, {
                  links: [
                    ...(length > 0 && t !== D
                      ? [
                          {
                            id: 'reset',
                            title: 'Reset viewport',
                            icon: l.createElement(ie, null),
                            onClick: () => {
                              (I({ value: void 0, isRotated: !1 }), r());
                            },
                          },
                        ]
                      : []),
                    ...Object.entries(a).map(([u, p]) => ({
                      id: u,
                      title: p.name,
                      icon: xe[p.type],
                      active: u === c,
                      onClick: () => {
                        (I({ value: u, isRotated: !1 }), r());
                      },
                    })),
                  ].flat(),
                }),
              closeOnOutsideClick: !0,
              onVisibleChange: d,
            },
            l.createElement(
              Re,
              {
                disabled: o,
                key: 'viewport',
                title: 'Change the size of the preview',
                active: i,
                onDoubleClick: () => {
                  I({ value: void 0, isRotated: !1 });
                },
              },
              l.createElement(j, null),
              t !== D ? l.createElement(Ae, null, t.name, ' ', s ? '(L)' : '(P)') : null,
            ),
          ),
          l.createElement(Y, {
            styles: { 'iframe[data-is-storybook="true"]': { width: m, height: n } },
          }),
          t !== D
            ? l.createElement(
                Te,
                null,
                l.createElement(ce, { title: 'Viewport width' }, m.replace('px', '')),
                o
                  ? '/'
                  : l.createElement(
                      L,
                      {
                        key: 'viewport-rotate',
                        title: 'Rotate viewport',
                        onClick: () => {
                          I({ value: c, isRotated: !s });
                        },
                      },
                      l.createElement(K, null),
                    ),
                l.createElement(ce, { title: 'Viewport height' }, n.replace('px', '')),
              )
            : null,
        );
      }),
      De = (0, $.default)(50)((e) => [
        ...Pe,
        ...Object.entries(e).map(([t, { name: a, ...c }]) => ({ ...c, id: t, title: a })),
      ]),
      V = { id: 'reset', title: 'Reset viewport', styles: null, type: 'other' },
      Pe = [V],
      Me = (0, $.default)(50)((e, t, a, c) =>
        e
          .filter((s) => s.id !== V.id || t.id !== s.id)
          .map((s) => ({
            ...s,
            onClick: () => {
              (a({ viewport: s.id }), c());
            },
          })),
      ),
      Ve = ({ width: e, height: t, ...a }) => ({ ...a, height: e, width: t }),
      Ue = S.div({ display: 'inline-flex', alignItems: 'center' }),
      ue = S.div(({ theme: e }) => ({
        display: 'inline-block',
        textDecoration: 'none',
        padding: 10,
        fontWeight: e.typography.weight.bold,
        fontSize: e.typography.size.s2 - 1,
        lineHeight: '1',
        height: 40,
        border: 'none',
        borderTop: '3px solid transparent',
        borderBottom: '3px solid transparent',
        background: 'transparent',
      })),
      Ne = S(L)(() => ({ display: 'inline-flex', alignItems: 'center' })),
      ze = S.div(({ theme: e }) => ({ fontSize: e.typography.size.s2 - 1, marginLeft: 10 })),
      He = (e, t, a) => {
        if (t === null) return;
        let c = typeof t == 'function' ? t(e) : t;
        return a ? Ve(c) : c;
      },
      Ge = Q(function () {
        let [e, t] = G(),
          { viewports: a = pe, defaultOrientation: c, defaultViewport: s, disable: b } = F(R, {}),
          d = De(a),
          o = oe(),
          [i, m] = z(!1);
        (s &&
          !d.find((u) => u.id === s) &&
          console.warn(
            `Cannot find "defaultViewport" of "${s}" in addon-viewport configs, please check the "viewports" setting in the configuration.`,
          ),
          x(() => {
            Ie(o, e, t, Object.keys(a));
          }, [a, e, e.viewport, t, o]),
          x(() => {
            let u = c === 'landscape';
            ((s && e.viewport !== s) || (c && e.viewportRotated !== u)) &&
              t({ viewport: s, viewportRotated: u });
          }, [c, s, t]));
        let n =
            d.find((u) => u.id === e.viewport) ||
            d.find((u) => u.id === s) ||
            d.find((u) => u.default) ||
            V,
          I = ee(),
          r = He(I.current, n.styles, e.viewportRotated);
        return (
          x(() => {
            I.current = r;
          }, [n]),
          b || Object.entries(a).length === 0
            ? null
            : l.createElement(
                M,
                null,
                l.createElement(
                  W,
                  {
                    placement: 'top',
                    tooltip: ({ onHide: u }) => l.createElement(q, { links: Me(d, n, t, u) }),
                    closeOnOutsideClick: !0,
                    onVisibleChange: m,
                  },
                  l.createElement(
                    Ne,
                    {
                      key: 'viewport',
                      title: 'Change the size of the preview',
                      active: i || !!r,
                      onDoubleClick: () => {
                        t({ viewport: V.id });
                      },
                    },
                    l.createElement(j, null),
                    r
                      ? l.createElement(
                          ze,
                          null,
                          e.viewportRotated ? `${n.title} (L)` : `${n.title} (P)`,
                        )
                      : null,
                  ),
                ),
                r
                  ? l.createElement(
                      Ue,
                      null,
                      l.createElement(Y, {
                        styles: {
                          'iframe[data-is-storybook="true"]': {
                            ...(r || { width: '100%', height: '100%' }),
                          },
                        },
                      }),
                      l.createElement(ue, { title: 'Viewport width' }, r.width.replace('px', '')),
                      l.createElement(
                        L,
                        {
                          key: 'viewport-rotate',
                          title: 'Rotate viewport',
                          onClick: () => {
                            t({ viewportRotated: !e.viewportRotated });
                          },
                        },
                        l.createElement(K, null),
                      ),
                      l.createElement(ue, { title: 'Viewport height' }, r.height.replace('px', '')),
                    )
                  : null,
              )
        );
      });
    H.register(B, (e) => {
      H.add(B, {
        title: 'viewport / media-queries',
        type: te.TOOL,
        match: ({ viewMode: t, tabId: a }) => t === 'story' && !a,
        render: () => (FEATURES?.viewportStoryGlobals ? N(Le, { api: e }) : N(Ge, null)),
      });
    });
  })();
} catch (e) {
  console.error('[Storybook] One of your manager-entries failed: ' + import.meta.url, e);
}
