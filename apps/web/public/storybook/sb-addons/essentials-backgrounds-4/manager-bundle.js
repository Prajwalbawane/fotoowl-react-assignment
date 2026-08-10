try {
  (() => {
    var re = Object.create;
    var W = Object.defineProperty;
    var ie = Object.getOwnPropertyDescriptor;
    var ae = Object.getOwnPropertyNames;
    var ce = Object.getPrototypeOf,
      se = Object.prototype.hasOwnProperty;
    var w = ((e) =>
      typeof require < 'u'
        ? require
        : typeof Proxy < 'u'
          ? new Proxy(e, { get: (o, c) => (typeof require < 'u' ? require : o)[c] })
          : e)(function (e) {
      if (typeof require < 'u') return require.apply(this, arguments);
      throw Error('Dynamic require of "' + e + '" is not supported');
    });
    var P = (e, o) => () => (e && (o = e((e = 0))), o);
    var le = (e, o) => () => (o || e((o = { exports: {} }).exports, o), o.exports);
    var ue = (e, o, c, r) => {
      if ((o && typeof o == 'object') || typeof o == 'function')
        for (let i of ae(o))
          !se.call(e, i) &&
            i !== c &&
            W(e, i, { get: () => o[i], enumerable: !(r = ie(o, i)) || r.enumerable });
      return e;
    };
    var Ie = (e, o, c) => (
      (c = e != null ? re(ce(e)) : {}),
      ue(o || !e || !e.__esModule ? W(c, 'default', { value: e, enumerable: !0 }) : c, e)
    );
    var p = P(() => {});
    var h = P(() => {});
    var f = P(() => {});
    var X = le((Q, V) => {
      p();
      h();
      f();
      (function (e) {
        if (typeof Q == 'object' && typeof V < 'u') V.exports = e();
        else if (typeof define == 'function' && define.amd) define([], e);
        else {
          var o;
          (typeof window < 'u' || typeof window < 'u'
            ? (o = window)
            : typeof self < 'u'
              ? (o = self)
              : (o = this),
            (o.memoizerific = e()));
        }
      })(function () {
        var e, o, c;
        return (function r(i, d, s) {
          function n(a, I) {
            if (!d[a]) {
              if (!i[a]) {
                var l = typeof w == 'function' && w;
                if (!I && l) return l(a, !0);
                if (t) return t(a, !0);
                var k = new Error("Cannot find module '" + a + "'");
                throw ((k.code = 'MODULE_NOT_FOUND'), k);
              }
              var m = (d[a] = { exports: {} });
              i[a][0].call(
                m.exports,
                function (b) {
                  var C = i[a][1][b];
                  return n(C || b);
                },
                m,
                m.exports,
                r,
                i,
                d,
                s,
              );
            }
            return d[a].exports;
          }
          for (var t = typeof w == 'function' && w, u = 0; u < s.length; u++) n(s[u]);
          return n;
        })(
          {
            1: [
              function (r, i, d) {
                i.exports = function (s) {
                  if (typeof Map != 'function' || s) {
                    var n = r('./similar');
                    return new n();
                  } else return new Map();
                };
              },
              { './similar': 2 },
            ],
            2: [
              function (r, i, d) {
                function s() {
                  return ((this.list = []), (this.lastItem = void 0), (this.size = 0), this);
                }
                ((s.prototype.get = function (n) {
                  var t;
                  if (this.lastItem && this.isEqual(this.lastItem.key, n)) return this.lastItem.val;
                  if (((t = this.indexOf(n)), t >= 0))
                    return ((this.lastItem = this.list[t]), this.list[t].val);
                }),
                  (s.prototype.set = function (n, t) {
                    var u;
                    return this.lastItem && this.isEqual(this.lastItem.key, n)
                      ? ((this.lastItem.val = t), this)
                      : ((u = this.indexOf(n)),
                        u >= 0
                          ? ((this.lastItem = this.list[u]), (this.list[u].val = t), this)
                          : ((this.lastItem = { key: n, val: t }),
                            this.list.push(this.lastItem),
                            this.size++,
                            this));
                  }),
                  (s.prototype.delete = function (n) {
                    var t;
                    if (
                      (this.lastItem &&
                        this.isEqual(this.lastItem.key, n) &&
                        (this.lastItem = void 0),
                      (t = this.indexOf(n)),
                      t >= 0)
                    )
                      return (this.size--, this.list.splice(t, 1)[0]);
                  }),
                  (s.prototype.has = function (n) {
                    var t;
                    return this.lastItem && this.isEqual(this.lastItem.key, n)
                      ? !0
                      : ((t = this.indexOf(n)), t >= 0 ? ((this.lastItem = this.list[t]), !0) : !1);
                  }),
                  (s.prototype.forEach = function (n, t) {
                    var u;
                    for (u = 0; u < this.size; u++)
                      n.call(t || this, this.list[u].val, this.list[u].key, this);
                  }),
                  (s.prototype.indexOf = function (n) {
                    var t;
                    for (t = 0; t < this.size; t++) if (this.isEqual(this.list[t].key, n)) return t;
                    return -1;
                  }),
                  (s.prototype.isEqual = function (n, t) {
                    return n === t || (n !== n && t !== t);
                  }),
                  (i.exports = s));
              },
              {},
            ],
            3: [
              function (r, i, d) {
                var s = r('map-or-similar');
                i.exports = function (a) {
                  var I = new s(!1),
                    l = [];
                  return function (k) {
                    var m = function () {
                      var b = I,
                        C,
                        R,
                        O = arguments.length - 1,
                        x = Array(O + 1),
                        A = !0,
                        T;
                      if ((m.numArgs || m.numArgs === 0) && m.numArgs !== O + 1)
                        throw new Error(
                          'Memoizerific functions should always be called with the same number of arguments',
                        );
                      for (T = 0; T < O; T++) {
                        if (((x[T] = { cacheItem: b, arg: arguments[T] }), b.has(arguments[T]))) {
                          b = b.get(arguments[T]);
                          continue;
                        }
                        ((A = !1), (C = new s(!1)), b.set(arguments[T], C), (b = C));
                      }
                      return (
                        A && (b.has(arguments[O]) ? (R = b.get(arguments[O])) : (A = !1)),
                        A || ((R = k.apply(null, arguments)), b.set(arguments[O], R)),
                        a > 0 &&
                          ((x[O] = { cacheItem: b, arg: arguments[O] }),
                          A ? n(l, x) : l.push(x),
                          l.length > a && t(l.shift())),
                        (m.wasMemoized = A),
                        (m.numArgs = O + 1),
                        R
                      );
                    };
                    return ((m.limit = a), (m.wasMemoized = !1), (m.cache = I), (m.lru = l), m);
                  };
                };
                function n(a, I) {
                  var l = a.length,
                    k = I.length,
                    m,
                    b,
                    C;
                  for (b = 0; b < l; b++) {
                    for (m = !0, C = 0; C < k; C++)
                      if (!u(a[b][C].arg, I[C].arg)) {
                        m = !1;
                        break;
                      }
                    if (m) break;
                  }
                  a.push(a.splice(b, 1)[0]);
                }
                function t(a) {
                  var I = a.length,
                    l = a[I - 1],
                    k,
                    m;
                  for (
                    l.cacheItem.delete(l.arg), m = I - 2;
                    m >= 0 && ((l = a[m]), (k = l.cacheItem.get(l.arg)), !k || !k.size);
                    m--
                  )
                    l.cacheItem.delete(l.arg);
                }
                function u(a, I) {
                  return a === I || (a !== a && I !== I);
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
    p();
    h();
    f();
    p();
    h();
    f();
    p();
    h();
    f();
    p();
    h();
    f();
    var g = __REACT__,
      {
        Children: we,
        Component: Ee,
        Fragment: M,
        Profiler: Be,
        PureComponent: Re,
        StrictMode: xe,
        Suspense: Le,
        __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: De,
        cloneElement: Pe,
        createContext: Me,
        createElement: Ue,
        createFactory: Ge,
        createRef: Ne,
        forwardRef: Fe,
        isValidElement: He,
        lazy: qe,
        memo: E,
        startTransition: ze,
        unstable_act: Ke,
        useCallback: U,
        useContext: Ve,
        useDebugValue: Ye,
        useDeferredValue: We,
        useEffect: je,
        useId: $e,
        useImperativeHandle: Ze,
        useInsertionEffect: Je,
        useLayoutEffect: Qe,
        useMemo: j,
        useReducer: Xe,
        useRef: eo,
        useState: G,
        useSyncExternalStore: oo,
        useTransition: to,
        version: no,
      } = __REACT__;
    p();
    h();
    f();
    var so = __STORYBOOK_API__,
      {
        ActiveTabs: lo,
        Consumer: uo,
        ManagerContext: Io,
        Provider: mo,
        RequestResponseError: po,
        addons: N,
        combineParameters: ho,
        controlOrMetaKey: fo,
        controlOrMetaSymbol: go,
        eventMatchesShortcut: bo,
        eventToShortcut: ko,
        experimental_MockUniversalStore: Co,
        experimental_UniversalStore: _o,
        experimental_requestResponse: yo,
        experimental_useUniversalStore: So,
        isMacLike: vo,
        isShortcutTaken: Oo,
        keyToSymbol: To,
        merge: Ao,
        mockChannel: wo,
        optionOrAltSymbol: Eo,
        shortcutMatchesShortcut: Bo,
        shortcutToHumanString: Ro,
        types: $,
        useAddonState: xo,
        useArgTypes: Lo,
        useArgs: Do,
        useChannel: Po,
        useGlobalTypes: Mo,
        useGlobals: L,
        useParameter: D,
        useSharedState: Uo,
        useStoryPrepared: Go,
        useStorybookApi: No,
        useStorybookState: Fo,
      } = __STORYBOOK_API__;
    p();
    h();
    f();
    var Vo = __STORYBOOK_COMPONENTS__,
      {
        A: Yo,
        ActionBar: Wo,
        AddonPanel: jo,
        Badge: $o,
        Bar: Zo,
        Blockquote: Jo,
        Button: Qo,
        ClipboardCode: Xo,
        Code: et,
        DL: ot,
        Div: tt,
        DocumentWrapper: nt,
        EmptyTabContent: rt,
        ErrorFormatter: it,
        FlexBar: at,
        Form: ct,
        H1: st,
        H2: lt,
        H3: ut,
        H4: It,
        H5: dt,
        H6: mt,
        HR: pt,
        IconButton: B,
        IconButtonSkeleton: ht,
        Icons: ft,
        Img: gt,
        LI: bt,
        Link: kt,
        ListItem: Ct,
        Loader: _t,
        Modal: yt,
        OL: St,
        P: vt,
        Placeholder: Ot,
        Pre: Tt,
        ProgressSpinner: At,
        ResetWrapper: wt,
        ScrollArea: Et,
        Separator: Bt,
        Spaced: Rt,
        Span: xt,
        StorybookIcon: Lt,
        StorybookLogo: Dt,
        Symbols: Pt,
        SyntaxHighlighter: Mt,
        TT: Ut,
        TabBar: Gt,
        TabButton: Nt,
        TabWrapper: Ft,
        Table: Ht,
        Tabs: qt,
        TabsState: zt,
        TooltipLinkList: F,
        TooltipMessage: Kt,
        TooltipNote: Vt,
        UL: Yt,
        WithTooltip: H,
        WithTooltipPure: Wt,
        Zoom: jt,
        codeCommon: $t,
        components: Zt,
        createCopyToClipboardFunction: Jt,
        getStoryHref: Qt,
        icons: Xt,
        interleaveSeparators: en,
        nameSpaceClassNames: on,
        resetComponents: tn,
        withReset: nn,
      } = __STORYBOOK_COMPONENTS__;
    p();
    h();
    f();
    var ln = __STORYBOOK_ICONS__,
      {
        AccessibilityAltIcon: un,
        AccessibilityIcon: In,
        AccessibilityIgnoredIcon: dn,
        AddIcon: mn,
        AdminIcon: pn,
        AlertAltIcon: hn,
        AlertIcon: fn,
        AlignLeftIcon: gn,
        AlignRightIcon: bn,
        AppleIcon: kn,
        ArrowBottomLeftIcon: Cn,
        ArrowBottomRightIcon: _n,
        ArrowDownIcon: yn,
        ArrowLeftIcon: Sn,
        ArrowRightIcon: vn,
        ArrowSolidDownIcon: On,
        ArrowSolidLeftIcon: Tn,
        ArrowSolidRightIcon: An,
        ArrowSolidUpIcon: wn,
        ArrowTopLeftIcon: En,
        ArrowTopRightIcon: Bn,
        ArrowUpIcon: Rn,
        AzureDevOpsIcon: xn,
        BackIcon: Ln,
        BasketIcon: Dn,
        BatchAcceptIcon: Pn,
        BatchDenyIcon: Mn,
        BeakerIcon: Un,
        BellIcon: Gn,
        BitbucketIcon: Nn,
        BoldIcon: Fn,
        BookIcon: Hn,
        BookmarkHollowIcon: qn,
        BookmarkIcon: zn,
        BottomBarIcon: Kn,
        BottomBarToggleIcon: Vn,
        BoxIcon: Yn,
        BranchIcon: Wn,
        BrowserIcon: jn,
        ButtonIcon: $n,
        CPUIcon: Zn,
        CalendarIcon: Jn,
        CameraIcon: Qn,
        CameraStabilizeIcon: Xn,
        CategoryIcon: er,
        CertificateIcon: or,
        ChangedIcon: tr,
        ChatIcon: nr,
        CheckIcon: rr,
        ChevronDownIcon: ir,
        ChevronLeftIcon: ar,
        ChevronRightIcon: cr,
        ChevronSmallDownIcon: sr,
        ChevronSmallLeftIcon: lr,
        ChevronSmallRightIcon: ur,
        ChevronSmallUpIcon: Ir,
        ChevronUpIcon: dr,
        ChromaticIcon: mr,
        ChromeIcon: pr,
        CircleHollowIcon: hr,
        CircleIcon: Z,
        ClearIcon: fr,
        CloseAltIcon: gr,
        CloseIcon: br,
        CloudHollowIcon: kr,
        CloudIcon: Cr,
        CogIcon: _r,
        CollapseIcon: yr,
        CommandIcon: Sr,
        CommentAddIcon: vr,
        CommentIcon: Or,
        CommentsIcon: Tr,
        CommitIcon: Ar,
        CompassIcon: wr,
        ComponentDrivenIcon: Er,
        ComponentIcon: Br,
        ContrastIcon: Rr,
        ContrastIgnoredIcon: xr,
        ControlsIcon: Lr,
        CopyIcon: Dr,
        CreditIcon: Pr,
        CrossIcon: Mr,
        DashboardIcon: Ur,
        DatabaseIcon: Gr,
        DeleteIcon: Nr,
        DiamondIcon: Fr,
        DirectionIcon: Hr,
        DiscordIcon: qr,
        DocChartIcon: zr,
        DocListIcon: Kr,
        DocumentIcon: Vr,
        DownloadIcon: Yr,
        DragIcon: Wr,
        EditIcon: jr,
        EllipsisIcon: $r,
        EmailIcon: Zr,
        ExpandAltIcon: Jr,
        ExpandIcon: Qr,
        EyeCloseIcon: Xr,
        EyeIcon: ei,
        FaceHappyIcon: oi,
        FaceNeutralIcon: ti,
        FaceSadIcon: ni,
        FacebookIcon: ri,
        FailedIcon: ii,
        FastForwardIcon: ai,
        FigmaIcon: ci,
        FilterIcon: si,
        FlagIcon: li,
        FolderIcon: ui,
        FormIcon: Ii,
        GDriveIcon: di,
        GithubIcon: mi,
        GitlabIcon: pi,
        GlobeIcon: hi,
        GoogleIcon: fi,
        GraphBarIcon: gi,
        GraphLineIcon: bi,
        GraphqlIcon: ki,
        GridAltIcon: Ci,
        GridIcon: q,
        GrowIcon: _i,
        HeartHollowIcon: yi,
        HeartIcon: Si,
        HomeIcon: vi,
        HourglassIcon: Oi,
        InfoIcon: Ti,
        ItalicIcon: Ai,
        JumpToIcon: wi,
        KeyIcon: Ei,
        LightningIcon: Bi,
        LightningOffIcon: Ri,
        LinkBrokenIcon: xi,
        LinkIcon: Li,
        LinkedinIcon: Di,
        LinuxIcon: Pi,
        ListOrderedIcon: Mi,
        ListUnorderedIcon: Ui,
        LocationIcon: Gi,
        LockIcon: Ni,
        MarkdownIcon: Fi,
        MarkupIcon: Hi,
        MediumIcon: qi,
        MemoryIcon: zi,
        MenuIcon: Ki,
        MergeIcon: Vi,
        MirrorIcon: Yi,
        MobileIcon: Wi,
        MoonIcon: ji,
        NutIcon: $i,
        OutboxIcon: Zi,
        OutlineIcon: Ji,
        PaintBrushIcon: Qi,
        PaperClipIcon: Xi,
        ParagraphIcon: ea,
        PassedIcon: oa,
        PhoneIcon: ta,
        PhotoDragIcon: na,
        PhotoIcon: z,
        PhotoStabilizeIcon: ra,
        PinAltIcon: ia,
        PinIcon: aa,
        PlayAllHollowIcon: ca,
        PlayBackIcon: sa,
        PlayHollowIcon: la,
        PlayIcon: ua,
        PlayNextIcon: Ia,
        PlusIcon: da,
        PointerDefaultIcon: ma,
        PointerHandIcon: pa,
        PowerIcon: ha,
        PrintIcon: fa,
        ProceedIcon: ga,
        ProfileIcon: ba,
        PullRequestIcon: ka,
        QuestionIcon: Ca,
        RSSIcon: _a,
        RedirectIcon: ya,
        ReduxIcon: Sa,
        RefreshIcon: J,
        ReplyIcon: va,
        RepoIcon: Oa,
        RequestChangeIcon: Ta,
        RewindIcon: Aa,
        RulerIcon: wa,
        SaveIcon: Ea,
        SearchIcon: Ba,
        ShareAltIcon: Ra,
        ShareIcon: xa,
        ShieldIcon: La,
        SideBySideIcon: Da,
        SidebarAltIcon: Pa,
        SidebarAltToggleIcon: Ma,
        SidebarIcon: Ua,
        SidebarToggleIcon: Ga,
        SpeakerIcon: Na,
        StackedIcon: Fa,
        StarHollowIcon: Ha,
        StarIcon: qa,
        StatusFailIcon: za,
        StatusIcon: Ka,
        StatusPassIcon: Va,
        StatusWarnIcon: Ya,
        StickerIcon: Wa,
        StopAltHollowIcon: ja,
        StopAltIcon: $a,
        StopIcon: Za,
        StorybookIcon: Ja,
        StructureIcon: Qa,
        SubtractIcon: Xa,
        SunIcon: ec,
        SupportIcon: oc,
        SweepIcon: tc,
        SwitchAltIcon: nc,
        SyncIcon: rc,
        TabletIcon: ic,
        ThumbsUpIcon: ac,
        TimeIcon: cc,
        TimerIcon: sc,
        TransferIcon: lc,
        TrashIcon: uc,
        TwitterIcon: Ic,
        TypeIcon: dc,
        UbuntuIcon: mc,
        UndoIcon: pc,
        UnfoldIcon: hc,
        UnlockIcon: fc,
        UnpinIcon: gc,
        UploadIcon: bc,
        UserAddIcon: kc,
        UserAltIcon: Cc,
        UserIcon: _c,
        UsersIcon: yc,
        VSCodeIcon: Sc,
        VerifiedIcon: vc,
        VideoIcon: Oc,
        WandIcon: Tc,
        WatchIcon: Ac,
        WindowsIcon: wc,
        WrenchIcon: Ec,
        XIcon: Bc,
        YoutubeIcon: Rc,
        ZoomIcon: xc,
        ZoomOutIcon: Lc,
        ZoomResetIcon: Dc,
        iconList: Pc,
      } = __STORYBOOK_ICONS__;
    p();
    h();
    f();
    var Fc = __STORYBOOK_CLIENT_LOGGER__,
      { deprecate: Hc, logger: K, once: qc, pretty: zc } = __STORYBOOK_CLIENT_LOGGER__;
    var Y = Ie(X());
    p();
    h();
    f();
    var Qc = __STORYBOOK_THEMING__,
      {
        CacheProvider: Xc,
        ClassNames: es,
        Global: os,
        ThemeProvider: ts,
        background: ns,
        color: rs,
        convert: is,
        create: as,
        createCache: cs,
        createGlobal: ss,
        createReset: ls,
        css: us,
        darken: Is,
        ensure: ds,
        ignoreSsrWarning: ms,
        isPropValid: ps,
        jsx: hs,
        keyframes: fs,
        lighten: gs,
        styled: ee,
        themes: bs,
        typography: ks,
        useTheme: Cs,
        withTheme: _s,
      } = __STORYBOOK_THEMING__;
    p();
    h();
    f();
    function oe(e) {
      for (var o = [], c = 1; c < arguments.length; c++) o[c - 1] = arguments[c];
      var r = Array.from(typeof e == 'string' ? [e] : e);
      r[r.length - 1] = r[r.length - 1].replace(/\r?\n([\t ]*)$/, '');
      var i = r.reduce(function (n, t) {
        var u = t.match(/\n([\t ]+|(?!\s).)/g);
        return u
          ? n.concat(
              u.map(function (a) {
                var I, l;
                return (l =
                  (I = a.match(/[\t ]/g)) === null || I === void 0 ? void 0 : I.length) !== null &&
                  l !== void 0
                  ? l
                  : 0;
              }),
            )
          : n;
      }, []);
      if (i.length) {
        var d = new RegExp(
          `
[	 ]{`.concat(Math.min.apply(Math, i), '}'),
          'g',
        );
        r = r.map(function (n) {
          return n.replace(
            d,
            `
`,
          );
        });
      }
      r[0] = r[0].replace(/^\r?\n/, '');
      var s = r[0];
      return (
        o.forEach(function (n, t) {
          var u = s.match(/(?:^|\n)( *)$/),
            a = u ? u[1] : '',
            I = n;
          (typeof n == 'string' &&
            n.includes(`
`) &&
            (I = String(n)
              .split(
                `
`,
              )
              .map(function (l, k) {
                return k === 0 ? l : ''.concat(a).concat(l);
              }).join(`
`)),
            (s += I + r[t + 1]));
        }),
        s
      );
    }
    var te = 'storybook/background',
      _ = 'backgrounds',
      de = { light: { name: 'light', value: '#F8F8F8' }, dark: { name: 'dark', value: '#333' } },
      me = E(function () {
        let e = D(_),
          [o, c, r] = L(),
          [i, d] = G(!1),
          { options: s = de, disable: n = !0 } = e || {};
        if (n) return null;
        let t = o[_] || {},
          u = t.value,
          a = t.grid || !1,
          I = s[u],
          l = !!r?.[_],
          k = Object.keys(s).length;
        return g.createElement(pe, {
          length: k,
          backgroundMap: s,
          item: I,
          updateGlobals: c,
          backgroundName: u,
          setIsTooltipVisible: d,
          isLocked: l,
          isGridActive: a,
          isTooltipVisible: i,
        });
      }),
      pe = E(function (e) {
        let {
            item: o,
            length: c,
            updateGlobals: r,
            setIsTooltipVisible: i,
            backgroundMap: d,
            backgroundName: s,
            isLocked: n,
            isGridActive: t,
            isTooltipVisible: u,
          } = e,
          a = U(
            (I) => {
              r({ [_]: I });
            },
            [r],
          );
        return g.createElement(
          M,
          null,
          g.createElement(
            B,
            {
              key: 'grid',
              active: t,
              disabled: n,
              title: 'Apply a grid to the preview',
              onClick: () => a({ value: s, grid: !t }),
            },
            g.createElement(q, null),
          ),
          c > 0
            ? g.createElement(
                H,
                {
                  key: 'background',
                  placement: 'top',
                  closeOnOutsideClick: !0,
                  tooltip: ({ onHide: I }) =>
                    g.createElement(F, {
                      links: [
                        ...(o
                          ? [
                              {
                                id: 'reset',
                                title: 'Reset background',
                                icon: g.createElement(J, null),
                                onClick: () => {
                                  (a({ value: void 0, grid: t }), I());
                                },
                              },
                            ]
                          : []),
                        ...Object.entries(d).map(([l, k]) => ({
                          id: l,
                          title: k.name,
                          icon: g.createElement(Z, { color: k?.value || 'grey' }),
                          active: l === s,
                          onClick: () => {
                            (a({ value: l, grid: t }), I());
                          },
                        })),
                      ].flat(),
                    }),
                  onVisibleChange: i,
                },
                g.createElement(
                  B,
                  {
                    disabled: n,
                    key: 'background',
                    title: 'Change the background of the preview',
                    active: !!o || u,
                  },
                  g.createElement(z, null),
                ),
              )
            : null,
        );
      }),
      he = ee.span(
        ({ background: e }) => ({
          borderRadius: '1rem',
          display: 'block',
          height: '1rem',
          width: '1rem',
          background: e,
        }),
        ({ theme: e }) => ({ boxShadow: `${e.appBorderColor} 0 0 0 1px inset` }),
      ),
      fe = (e, o = [], c) => {
        if (e === 'transparent') return 'transparent';
        if (o.find((i) => i.value === e) || e) return e;
        let r = o.find((i) => i.name === c);
        if (r) return r.value;
        if (c) {
          let i = o.map((d) => d.name).join(', ');
          K.warn(oe`
        Backgrounds Addon: could not find the default color "${c}".
        These are the available colors for your story based on your configuration:
        ${i}.
      `);
        }
        return 'transparent';
      },
      ne = (0, Y.default)(1e3)((e, o, c, r, i, d) => ({
        id: e || o,
        title: o,
        onClick: () => {
          i({ selected: c, name: o });
        },
        value: c,
        right: r ? g.createElement(he, { background: c }) : void 0,
        active: d,
      })),
      ge = (0, Y.default)(10)((e, o, c) => {
        let r = e.map(({ name: i, value: d }) => ne(null, i, d, !0, c, d === o));
        return o !== 'transparent'
          ? [ne('reset', 'Clear background', 'transparent', null, c, !1), ...r]
          : r;
      }),
      be = { default: null, disable: !0, values: [] },
      ke = E(function () {
        let e = D(_, be),
          [o, c] = G(!1),
          [r, i] = L(),
          d = r[_]?.value,
          s = j(() => fe(d, e.values, e.default), [e, d]);
        Array.isArray(e) &&
          K.warn(
            'Addon Backgrounds api has changed in Storybook 6.0. Please refer to the migration guide: https://github.com/storybookjs/storybook/blob/next/MIGRATION.md',
          );
        let n = U(
          (t) => {
            i({ [_]: { ...r[_], value: t } });
          },
          [e, r, i],
        );
        return e.disable
          ? null
          : g.createElement(
              H,
              {
                placement: 'top',
                closeOnOutsideClick: !0,
                tooltip: ({ onHide: t }) =>
                  g.createElement(F, {
                    links: ge(e.values, s, ({ selected: u }) => {
                      (s !== u && n(u), t());
                    }),
                  }),
                onVisibleChange: c,
              },
              g.createElement(
                B,
                {
                  key: 'background',
                  title: 'Change the background of the preview',
                  active: s !== 'transparent' || o,
                },
                g.createElement(z, null),
              ),
            );
      }),
      Ce = E(function () {
        let [e, o] = L(),
          { grid: c } = D(_, { grid: { disable: !1 } });
        if (c?.disable) return null;
        let r = e[_]?.grid || !1;
        return g.createElement(
          B,
          {
            key: 'background',
            active: r,
            title: 'Apply a grid to the preview',
            onClick: () => o({ [_]: { ...e[_], grid: !r } }),
          },
          g.createElement(q, null),
        );
      });
    N.register(te, () => {
      N.add(te, {
        title: 'Backgrounds',
        type: $.TOOL,
        match: ({ viewMode: e, tabId: o }) => !!(e && e.match(/^(story|docs)$/)) && !o,
        render: () =>
          FEATURES?.backgroundsStoryGlobals
            ? g.createElement(me, null)
            : g.createElement(M, null, g.createElement(ke, null), g.createElement(Ce, null)),
      });
    });
  })();
} catch (e) {
  console.error('[Storybook] One of your manager-entries failed: ' + import.meta.url, e);
}
