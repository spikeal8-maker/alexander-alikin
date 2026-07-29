# Editorial site V4 browser gate

Status: FAIL

```text

> alexander-alikin@0.1.0 design:browser
> node scripts/validate-design-browser.mjs

Routes tested: 25 × 5 viewports + 404
Screenshots: 42 files
BROWSER ERRORS:
home @320: V3 header missing
home @320: V3 hero title missing
home @320: V3 primary CTA missing
home @320: V3 portrait composition missing or too small
home @390: V3 header missing
home @390: V3 hero title missing
home @390: V3 primary CTA missing
home @390: V3 portrait composition missing or too small
home @768: V3 header missing
home @768: V3 hero title missing
home @768: V3 primary CTA missing
home @768: V3 portrait composition missing or too small
home @1024: V3 header missing
home @1024: V3 hero title missing
home @1024: V3 primary CTA missing
home @1024: V3 portrait composition missing or too small
home @1440: V3 header missing
home @1440: V3 hero title missing
home @1440: V3 primary CTA missing
home @1440: V3 portrait composition missing or too small
about @320: V3 header missing
about @390: V3 header missing
about @768: V3 header missing
about @1024: V3 header missing
about @1440: V3 header missing
business @320: V3 header missing
business @390: V3 header missing
business @768: V3 header missing
business @1024: V3 header missing
business @1440: V3 header missing
education @320: V3 header missing
education @390: V3 header missing
education @768: V3 header missing
education @1024: V3 header missing
education @1440: V3 header missing
projects @320: V3 header missing
projects @390: V3 header missing
projects @768: V3 header missing
projects @1024: V3 header missing
projects @1440: V3 header missing
izo-asa @320: V3 header missing
izo-asa @390: V3 header missing
izo-asa @768: V3 header missing
izo-asa @1024: V3 header missing
izo-asa @1440: V3 header missing
engineering-education @320: V3 header missing
engineering-education @390: V3 header missing
engineering-education @768: V3 header missing
engineering-education @1024: V3 header missing
engineering-education @1440: V3 header missing
journal @320: V3 header missing
journal @390: V3 header missing
journal @768: V3 header missing
journal @1024: V3 header missing
journal @1440: V3 header missing
articles @320: V3 header missing
articles @390: V3 header missing
articles @768: V3 header missing
articles @1024: V3 header missing
articles @1440: V3 header missing
project-learning @320: V3 header missing
project-learning @390: V3 header missing
project-learning @768: V3 header missing
project-learning @1024: V3 header missing
project-learning @1440: V3 header missing
stories @320: V3 header missing
stories @390: V3 header missing
stories @768: V3 header missing
stories @1024: V3 header missing
stories @1440: V3 header missing
children-and-robots @320: V3 header missing
children-and-robots @390: V3 header missing
children-and-robots @768: V3 header missing
children-and-robots @1024: V3 header missing
children-and-robots @1440: V3 header missing
one-method @320: V3 header missing
one-method @390: V3 header missing
one-method @768: V3 header missing
one-method @1024: V3 header missing
one-method @1440: V3 header missing
thoughts @320: V3 header missing
thoughts @390: V3 header missing
thoughts @768: V3 header missing
thoughts @1024: V3 header missing
thoughts @1440: V3 header missing
launch-thoughts @320: V3 header missing
launch-thoughts @390: V3 header missing
launch-thoughts @768: V3 header missing
launch-thoughts @1024: V3 header missing
launch-thoughts @1440: V3 header missing
news @320: V3 header missing
news @390: V3 header missing
news @768: V3 header missing
news @1024: V3 header missing
news @1440: V3 header missing
video @320: V3 header missing
video @390: V3 header missing
video @768: V3 header missing
video @1024: V3 header missing
video @1440: V3 header missing
contacts @320: V3 header missing
contacts @390: V3 header missing
contacts @768: V3 header missing
contacts @1024: V3 header missing
contacts @1440: V3 header missing
collaboration @320: V3 header missing
collaboration @390: V3 header missing
collaboration @768: V3 header missing
collaboration @1024: V3 header missing
collaboration @1440: V3 header missing
now @320: V3 header missing
now @390: V3 header missing
now @768: V3 header missing
now @1024: V3 header missing
now @1440: V3 header missing
facts @320: horizontal overflow (339 vs 320)
  └─ nav: left=244 right=300 width=56 client=56 scroll=116 min=0px position=fixed display=grid grid=96.4844px text="РаботаПроектыОбо мнеЖурналОбсудить задачу"
  └─ a: left=264 right=361 width=96 client=96 scroll=96 min=auto position=static display=block grid=none text="Работа"
  └─ a: left=264 right=361 width=96 client=96 scroll=96 min=auto position=static display=block grid=none text="Проекты"
  └─ a: left=264 right=361 width=96 client=96 scroll=96 min=auto position=static display=block grid=none text="Обо мне"
  └─ a: left=264 right=361 width=96 client=96 scroll=96 min=auto position=static display=block grid=none text="Журнал"
  └─ a.gn-menu__contact: left=264 right=361 width=96 client=96 scroll=96 min=auto position=static display=block grid=none text="Обсудить задачу"
  └─ div: left=20 right=339 width=319 client=319 scroll=319 min=auto position=static display=block grid=none text="Факты и источникиДоверие начинается с происхождения утверждения.Проверяемые факт"
  └─ p.gn-eyebrow: left=20 right=339 width=319 client=319 scroll=319 min=0px position=static display=block grid=none text="Факты и источники"
  └─ h1: left=20 right=339 width=319 client=319 scroll=319 min=0px position=static display=block grid=none text="Доверие начинается с происхождения утверждения."
  └─ p.gp-hero__lead: left=20 right=339 width=319 client=319 scroll=319 min=0px position=static display=block grid=none text="Проверяемые факты, слова автора, редакционные связки и стратегические гипотезы у"
  └─ aside.gp-panel: left=20 right=339 width=319 client=317 scroll=317 min=auto position=static display=block grid=none text="ПравилоЧисло без источника не становится фактом, даже если выглядит убедительно."
  └─ html: left=0 right=320 width=320 client=320 scroll=339 min=0px position=static display=block grid=none text="Факты и источники — Александр Аликин:root { --v3-paper: #f3f0e8; --v3-paper-deep"
facts @320: V3 header missing
facts @390: horizontal overflow (396 vs 390)
  └─ nav: left=314 right=370 width=56 client=56 scroll=116 min=0px position=fixed display=grid grid=96.4844px text="РаботаПроектыОбо мнеЖурналОбсудить задачу"
  └─ a: left=334 right=431 width=96 client=96 scroll=96 min=auto position=static display=block grid=none text="Работа"
  └─ a: left=334 right=431 width=96 client=96 scroll=96 min=auto position=static display=block grid=none text="Проекты"
  └─ a: left=334 right=431 width=96 client=96 scroll=96 min=auto position=static display=block grid=none text="Обо мне"
  └─ a: left=334 right=431 width=96 client=96 scroll=96 min=auto position=static display=block grid=none text="Журнал"
  └─ a.gn-menu__contact: left=334 right=431 width=96 client=96 scroll=96 min=auto position=static display=block grid=none text="Обсудить задачу"
  └─ html: left=0 right=390 width=390 client=390 scroll=396 min=0px position=static display=block grid=none text="Факты и источники — Александр Аликин:root { --v3-paper: #f3f0e8; --v3-paper-deep"
  └─ body: left=0 right=390 width=390 client=390 scroll=396 min=0px position=static display=block grid=none text="Перейти к содержимомуАлександр АликинРаботаПроектыОбо мнеЖурналОбсудить задачуМе"
  └─ #main-content: left=0 right=390 width=390 client=390 scroll=396 min=0px position=static display=block grid=none text="Факты и источникиДоверие начинается с происхождения утверждения.Проверяемые факт"
  └─ div.gp-page: left=0 right=390 width=390 client=390 scroll=396 min=0px position=static display=block grid=none text="Факты и источникиДоверие начинается с происхождения утверждения.Проверяемые факт"
  └─ section.gp-hero: left=0 right=390 width=390 client=390 scroll=396 min=0px position=static display=block grid=none text="Факты и источникиДоверие начинается с происхождения утверждения.Проверяемые факт"
  └─ div.gn-wrap.gp-hero__grid: left=0 right=390 width=390 client=390 scroll=396 min=0px position=static display=grid grid=375.516px text="Факты и источникиДоверие начинается с происхождения утверждения.Проверяемые факт"
facts @390: V3 header missing
facts @768: V3 header missing
facts @1024: V3 header missing
facts @1440: V3 header missing
second-brain @320: V3 header missing
second-brain @390: V3 header missing
second-brain @768: V3 header missing
second-brain @1024: V3 header missing
second-brain @1440: V3 header missing
press @320: V3 header missing
press @390: V3 header missing
press @768: V3 header missing
press @1024: V3 header missing
press @1440: V3 header missing
search @320: V3 header missing
search @390: V3 header missing
search @768: V3 header missing
search @1024: V3 header missing
search @1440: V3 header missing
privacy @320: horizontal overflow (329 vs 320)
  └─ nav: left=244 right=300 width=56 client=56 scroll=116 min=0px position=fixed display=grid grid=96.4844px text="РаботаПроектыОбо мнеЖурналОбсудить задачу"
  └─ a: left=264 right=361 width=96 client=96 scroll=96 min=auto position=static display=block grid=none text="Работа"
  └─ a: left=264 right=361 width=96 client=96 scroll=96 min=auto position=static display=block grid=none text="Проекты"
  └─ a: left=264 right=361 width=96 client=96 scroll=96 min=auto position=static display=block grid=none text="Обо мне"
  └─ a: left=264 right=361 width=96 client=96 scroll=96 min=auto position=static display=block grid=none text="Журнал"
  └─ a.gn-menu__contact: left=264 right=361 width=96 client=96 scroll=96 min=auto position=static display=block grid=none text="Обсудить задачу"
  └─ html: left=0 right=320 width=320 client=320 scroll=329 min=0px position=static display=block grid=none text="Конфиденциальность — Александр Аликин:root { --v3-paper: #f3f0e8; --v3-paper-dee"
  └─ body: left=0 right=320 width=320 client=320 scroll=329 min=0px position=static display=block grid=none text="Перейти к содержимомуАлександр АликинРаботаПроектыОбо мнеЖурналОбсудить задачуМе"
  └─ #main-content: left=0 right=320 width=320 client=320 scroll=329 min=0px position=static display=block grid=none text="КонфиденциальностьНе собирать больше, чем действительно необходимо.Текущая верси"
  └─ div.gp-page: left=0 right=320 width=320 client=320 scroll=329 min=0px position=static display=block grid=none text="КонфиденциальностьНе собирать больше, чем действительно необходимо.Текущая верси"
  └─ section.gp-hero: left=0 right=320 width=320 client=320 scroll=329 min=0px position=static display=block grid=none text="КонфиденциальностьНе собирать больше, чем действительно необходимо.Текущая верси"
  └─ div.gn-wrap.gp-hero__grid: left=0 right=320 width=320 client=320 scroll=329 min=0px position=static display=grid grid=308.766px text="КонфиденциальностьНе собирать больше, чем действительно необходимо.Текущая верси"
privacy @320: V3 header missing
privacy @390: V3 header missing
privacy @768: V3 header missing
privacy @1024: V3 header missing
privacy @1440: V3 header missing
not-found @320: V3 header missing
not-found @390: V3 header missing
not-found @768: V3 header missing
not-found @1024: V3 header missing
not-found @1440: V3 header missing
Text zoom 200%: horizontal overflow (1501 vs 1440)
  └─ h3: width=322 client=322 scroll=487 grid=none text="Предпринимательская"
  └─ article.gp-card: width=420 client=418 scroll=535 grid=none text="03ПредпринимательскаяУчитывать спрос, ресурсы, команду, риск и последствия решен"
  └─ div.gp-card-grid: width=1325 client=1325 scroll=1440 grid=420.266px 420.266px 420.281px text="01ИнженернаяПонять устройство, ограничения, данные и архитектуру решения.02Педаг"
  └─ a.gn-header__contact: width=224 client=224 scroll=224 grid=none text="Обсудить задачу"
  └─ html: width=1440 client=1440 scroll=1501 grid=none text="Обо мне — Александр Аликин:root { --v3-paper: #f3f0e8; --v3-paper-deep: #e7e0d3;"
  └─ body: width=1440 client=1440 scroll=1501 grid=none text="Перейти к содержимомуАлександр АликинРаботаПроектыОбо мнеЖурналОбсудить задачуМе"
  └─ header.gn-header: width=1440 client=1440 scroll=1501 grid=none text="Александр АликинРаботаПроектыОбо мнеЖурналОбсудить задачуМеню+РаботаПроектыОбо м"
  └─ div.gn-wrap.gn-header__inner: width=1440 client=1440 scroll=1501 grid=416px 483.594px 416px text="Александр АликинРаботаПроектыОбо мнеЖурналОбсудить задачуМеню+РаботаПроектыОбо м"
  └─ #main-content: width=1440 client=1440 scroll=1498 grid=none text="Обо мнеСобираю системы, которые можно проверить и передать.Я Александр Аликин — "
  └─ div.gp-page: width=1440 client=1440 scroll=1498 grid=none text="Обо мнеСобираю системы, которые можно проверить и передать.Я Александр Аликин — "
  └─ section.gp-section.gp-section--white: width=1440 client=1440 scroll=1498 grid=none text="Три ответственностиНе три профессии, а три проверки одного решения.Работает ли к"
  └─ div.gn-wrap: width=1440 client=1440 scroll=1498 grid=none text="Три ответственностиНе три профессии, а три проверки одного решения.Работает ли к"
Axe: serious color-contrast — Elements must meet minimum color contrast ratio thresholds [<p>Концепция, пользовательские сценарии, интерфейс, прототип, интеграции и тестирование — один связный продуктовый цикл.</p>]
```
