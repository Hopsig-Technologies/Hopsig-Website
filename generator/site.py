# Hopsig — full clickable prototype: Home · Services · Team · Rates · Book.
# Command-style experience (dot field → ring, scroll-jacked cards, sticky sequence, reveals) on the agreed structure.
import sys
sys.path.insert(0, "/tmp/claude-0/-home-claude/79df7775-e2c1-5360-bab2-1eab226cf378/scratchpad")
import site_base as B
from site_base import MONO, INK, PAPER, LIME, MOSS, TEXT, DIM, SUB, LINE, PANEL, HAIR, lab, h2, btn, BEATS
from hero_anim import panel as anim_panel
from lockup import lockup

OUTDIR = "./out/"

# ---- tone machinery: sections are authored with the dark constants, then hex → CSS vars; panels are protected and
# ---- generated in the tone of the surface they sit on.
TONE = {"t": "d", "panel": None, "file": None}
_PANELS = {}
def _panel_wrapper(dark=True, mode="static", static_phase=2, w=568, h=392, prefix="hm"):
    key = "<!--PANEL" + str(len(_PANELS)) + "-->"
    _PANELS[key] = anim_panel(dark=((TONE["panel"] or TONE["t"]) == "d"), mode=mode, static_phase=static_phase, w=w, h=h, prefix=prefix)
    return key
B.anim_panel = _panel_wrapper

VARMAP = [("background: #C6F24E; color: #0E1116;", "background: var(--btn); color: var(--btnText);"),
          ("background:#C6F24E;color:#0E1116", "background:var(--btn);color:var(--btnText)"),
          ("#E7ECEF", "var(--text)"), ("#939A96", "var(--dim)"), ("#B9BFB6", "var(--sub)"), ("#262C34", "var(--line)"),
          ("#12161C", "var(--panel)"), ("#1C222B", "var(--hair)"), ("#C6F24E", "var(--acc)"), ("#0E1116", "var(--bg)")]
def varify(html):
    for a, b in VARMAP: html = html.replace(a, b)
    return html
def restore(html):
    for k, v in _PANELS.items(): html = html.replace(k, v)
    return html
def surface(tone, html, seam=True, cls=""):
    """A run of same-tone sections on one surface; a seam (the previous grid bleeding in) at its top."""
    TONE["t"] = tone
    return '<div class="tone-' + tone + (' ' + cls if cls else '') + '">' + ('<div class="seam"></div>' if seam else '') + html + '</div>'
def D(fn):
    TONE["t"] = "d"; return fn
def L(fn):
    TONE["t"] = "l"; return fn
PAGES = [("Home", "SITE_Home.dc.html"), ("Services", "SITE_Services.dc.html"), ("Work", "SITE_Work.dc.html"), ("Industries", "SITE_Industries.dc.html"), ("Approach", "SITE_Approach.dc.html"), ("Rates", "SITE_Rates.dc.html")]
WORK = "SITE_Work.dc.html"
BOOK = "SITE_Book.dc.html"

EXTRA_CSS = '''

/* Core services — the file: eight spec sheets that stack as you scroll, each leaving its tab visible */
.file{position:relative;--tab:46px;--top:88px}
.file .dwell{height:560px}
.over{position:relative;z-index:19}
.file .endc{display:flex;justify-content:space-between;align-items:center;gap:24px;padding:34px 4px 0;font-family:'IBM Plex Mono',monospace;font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#939A96}
.file .endc a{color:#C6F24E;text-decoration:none;padding:8px 0}
.file .sheet{position:sticky;background:var(--panel);border:1px solid var(--line);border-radius:14px;margin-bottom:22px;overflow:hidden;will-change:transform;transform-origin:top center}
.file .sheet.end{background:var(--bg);border-color:transparent;border-radius:0;box-shadow:none}
.file .sheet .veil{position:absolute;left:0;right:0;bottom:0;top:var(--tab);background:var(--bg);opacity:0;pointer-events:none;transition:none}
.file .tab{height:var(--tab);box-sizing:border-box;display:grid;grid-template-columns:52px 1fr auto auto;gap:18px;align-items:center;padding:0 26px 0 24px;border-bottom:1px solid var(--line);cursor:pointer;background:var(--panel);transition:background .35s,border-color .35s}
.file .sheet.stacked .tab{background:rgb(198,242,78);border-bottom-color:rgb(180,222,66)}
.file .sheet.stacked .tab .n,.file .sheet.stacked .tab .t,.file .sheet.stacked .tab .s,.file .sheet.stacked .tab .m{color:rgb(14,17,22)}
.file .sheet.stacked .tab .s,.file .sheet.stacked .tab .m{opacity:.75}
.file .tab .n{font-family:'IBM Plex Mono',monospace;font-size:12px;letter-spacing:.14em;color:var(--acc)}
.file .tab .t{font-size:17px;font-weight:600;letter-spacing:-.02em;color:var(--text)}
.file .tab .s{font-family:'IBM Plex Mono',monospace;font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:var(--dim)}
.file .tab .m{font-family:'IBM Plex Mono',monospace;font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:var(--acc);text-decoration:none;padding:8px 0}
.file .sh{display:grid;grid-template-columns:1.15fr 1fr;gap:48px;padding:34px 36px 36px;position:relative}
.file .sh:before{content:"";position:absolute;inset:0;background-image:radial-gradient(var(--dot) 1px,transparent 1px);background-size:22px 22px;-webkit-mask-image:linear-gradient(to right,transparent 55%,#000);mask-image:linear-gradient(to right,transparent 55%,#000);opacity:.6;pointer-events:none}
.file .sh>*{position:relative}
.file .big{position:absolute;right:26px;top:14px;font-family:'IBM Plex Mono',monospace;font-size:88px;font-weight:500;letter-spacing:-.06em;line-height:1;color:var(--line);pointer-events:none;user-select:none}
.file h3{margin:0;font-size:32px;font-weight:600;letter-spacing:-.035em;line-height:1.1;max-width:520px}
.file p{margin:14px 0 0;font-size:16px;line-height:1.6;color:var(--sub);max-width:520px}
.file .get{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;margin-top:24px}
.file .get div{border-top:1px solid var(--line);padding-top:10px;font-size:14px;line-height:1.5;color:var(--sub)}
.file .get b{display:block;font-weight:600;color:var(--text);letter-spacing:-.01em;margin-bottom:4px}
.file .right{display:flex;flex-direction:column;gap:18px}
.file .good{display:flex;flex-direction:column;gap:6px;font-size:14px;line-height:1.5;color:var(--sub);max-width:360px}
.file .chips{display:flex;flex-wrap:wrap;gap:8px}
.file .chip{font-family:'IBM Plex Mono',monospace;font-size:12px;letter-spacing:.06em;color:var(--sub);border:1px solid var(--line);border-radius:8px;padding:8px 11px;background:var(--bg);transition:border-color .2s,color .2s}
.file .chip:hover{border-color:var(--acc);color:var(--text)}
.file .fee{margin-top:auto;display:flex;justify-content:space-between;gap:16px;border-top:1px solid var(--line);padding-top:12px;font-family:'IBM Plex Mono',monospace;font-size:12px;color:var(--dim)}
.file .fee b{color:var(--text);font-weight:500}
.file .legend{display:flex;gap:6px;margin-bottom:18px}
.file .legend i{flex:1;height:3px;border-radius:3px;background:var(--line);transition:background .25s}
.file .legend i.on{background:var(--acc)}
.tone-l,.tone-d{position:relative}
.seam{height:120px;margin:0 0 -120px;background-image:radial-gradient(var(--seamdot) 1px,transparent 1px);background-size:22px 22px;-webkit-mask-image:linear-gradient(#000,transparent);mask-image:linear-gradient(#000,transparent);pointer-events:none;position:relative;z-index:2}
.tone-l .hdr{display:none}
.pg{animation:pgin .32s ease both}
@keyframes pgin{from{opacity:0}to{opacity:1}}
.hdr nav a.nl{position:relative;padding:10px 0 8px;white-space:nowrap}
.hdr nav .dd{position:relative;display:flex;align-items:center}
.hdr nav .crt{display:inline-block;margin-left:6px;font-size:9px;opacity:.7;transition:transform .25s}
.hdr nav .dd:hover .crt,.hdr nav .dd:focus-within .crt,.hdr nav .dd.open .crt{transform:rotate(180deg)}
.hdr .menu{position:absolute;top:100%;left:-14px;padding-top:10px;opacity:0;pointer-events:none;transform:translateY(-6px);transition:opacity .2s,transform .25s cubic-bezier(.2,.8,.2,1);z-index:40}
.hdr .dd:hover .menu,.hdr .dd:focus-within .menu,.hdr .dd.open .menu{opacity:1;pointer-events:auto;transform:none}
.hdr .pnl{background:#12161C;border:1px solid #262C34;border-radius:12px;padding:8px;min-width:300px;display:flex;flex-direction:column;gap:2px}
.hdr .menu.wide .pnl{display:grid;grid-template-columns:1fr 1fr;gap:2px 8px;min-width:640px}
.hdr .mi{display:grid;grid-template-columns:26px 1fr;gap:10px;align-items:baseline;padding:10px 12px;border-radius:8px;text-decoration:none;color:#E7ECEF;transition:background .2s}
.hdr .mi:hover,.hdr .mi.on{background:#1C222B}
.hdr .mi .n{font-family:'IBM Plex Mono',monospace;font-size:10px;letter-spacing:.14em;color:#939A96}
.hdr .mi.on .n{color:#C6F24E}
.hdr .mi b{display:block;font-size:14px;font-weight:600;letter-spacing:-.01em;line-height:1.25}
.hdr .mi .d{display:block;font-size:12px;line-height:1.4;color:#939A96;margin-top:3px}
.hdr .mf{grid-column:1/-1;display:flex;justify-content:space-between;gap:20px;padding:12px 12px 6px;margin-top:4px;border-top:1px solid #1C222B;font-family:'IBM Plex Mono',monospace;font-size:11px;letter-spacing:.12em;text-transform:uppercase}
.hdr .mf a{color:#C6F24E;text-decoration:none}
@media (prefers-reduced-motion:reduce){.hdr .menu,.hdr nav .crt{transition:none}}
.hdr .cta{white-space:nowrap}
@media (max-width:1300px){.hdr nav{gap:18px!important}.hdr nav a.nl{letter-spacing:.08em!important}.hdr .cta{padding:12px 13px!important}}
@media (max-width:1180px){.hdr .wrap>a:first-child>span>span:last-child{display:none}.hdr nav{gap:14px!important}}
@media (max-width:1060px){.hdr nav a.nl.on{color:#E7ECEF}.hdr nav{gap:12px!important}.hdr nav a.nl{font-size:10px!important;letter-spacing:.06em!important}}
.hdr nav a.nl.on{color:#E7ECEF}
.hdr nav a.nl.on:after{content:"";position:absolute;left:0;right:0;bottom:-2px;height:2px;background:#C6F24E;border-radius:2px}
.hdr.always .cta{background:#C6F24E!important;color:#0E1116!important;box-shadow:none!important}
.ph{position:relative;overflow:hidden;padding:120px 0 80px}
.ph canvas{position:absolute;inset:0;width:100%;height:100%}
.ph .c{position:relative}
.chips{display:flex;gap:10px;flex-wrap:wrap}
.chip2{font-family:'IBM Plex Mono',monospace;font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#E7ECEF;border:1px solid #262C34;border-radius:8px;padding:10px 14px;text-decoration:none}
.chip2:hover{border-color:#939A96;color:#E7ECEF}
.svc{display:grid;grid-template-columns:1fr 568px;gap:64px;align-items:start;padding:100px 0;border-top:1px solid #1C222B}
.svc .ui{position:sticky;top:112px}
.list{display:flex;flex-direction:column}
.list div{display:grid;grid-template-columns:22px 1fr;gap:12px;padding:12px 0;border-top:1px solid #1C222B;font-size:15px;line-height:1.55;color:#B9BFB6}
.list div:last-child{border-bottom:1px solid #1C222B}
.list i{display:block;width:12px;height:12px;border-radius:3px;background:#C6F24E;margin-top:5px}
.price{border:1px solid #262C34;background:#12161C;border-radius:14px;padding:22px 24px;display:flex;flex-direction:column;gap:8px;margin-top:20px}
.tiles{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));border:1px solid #262C34;border-radius:12px;overflow:hidden}
.tiles>div{padding:22px;border-right:1px solid #262C34;border-bottom:1px solid #262C34;display:flex;flex-direction:column;gap:8px}
.tiles>div:nth-child(3n){border-right:0}.tiles>div:nth-child(n+4){border-bottom:0}
.steps{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:18px}
.steps>div{border-top:2px solid #262C34;padding-top:14px;display:flex;flex-direction:column;gap:6px}
.steps>div.on{border-top-color:#C6F24E}
.rate{border:1px solid #262C34;background:#12161C;border-radius:14px;padding:30px 28px;display:flex;flex-direction:column;gap:16px}
.rate.hi{box-shadow:inset 0 0 0 1px #C6F24E}
.rate .big{font-size:34px;font-weight:600;letter-spacing:-.04em;line-height:1.05}
.rate .big small{font-family:'IBM Plex Mono',monospace;font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:#939A96;font-weight:400}
.est{display:grid;grid-template-columns:1fr 1fr;gap:48px;border:1px solid #262C34;background:#12161C;border-radius:14px;padding:36px}
.est label{display:flex;justify-content:space-between;font-family:'IBM Plex Mono',monospace;font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#939A96;margin-bottom:10px}
.est input[type=range]{width:100%;accent-color:#C6F24E;margin:0 0 28px}
.est .out{display:flex;flex-direction:column;gap:12px;border-left:1px solid #262C34;padding-left:48px}
.est .out .n{font-size:44px;font-weight:600;letter-spacing:-.045em;line-height:1}
.terms{display:grid;grid-template-columns:1fr 1fr;gap:0 48px}
.terms div{display:flex;justify-content:space-between;gap:20px;padding:12px 0;border-top:1px solid #1C222B;font-family:'IBM Plex Mono',monospace;font-size:13px}
.terms div span:first-child{color:#939A96}
.faq .item{border-top:1px solid #262C34;padding:18px 0;cursor:pointer}
.faq .item .t{display:flex;justify-content:space-between;align-items:center;font-size:19px;font-weight:600;letter-spacing:-.02em;color:#B9BFB6}
.faq .item.on .t{color:#E7ECEF}
.faq .item .b{max-height:0;overflow:hidden;transition:max-height .35s;color:#939A96;font-size:15px;line-height:1.6}
.faq .item.on .b{max-height:160px;padding-top:8px}
.faq .pl{width:22px;height:22px;border-radius:6px;border:1px solid #262C34;display:flex;align-items:center;justify-content:center;font-family:'IBM Plex Mono',monospace;font-size:13px;color:#939A96}
.faq .item.on .pl{border-color:#C6F24E;color:#C6F24E}
.ov{position:relative;height:14px;border-radius:3px;background:#1C222B;overflow:hidden}
.ov i{position:absolute;top:0;bottom:0;border-radius:3px}
.book{display:grid;grid-template-columns:1fr 560px;gap:64px;align-items:start}
.cal{border:1px solid #262C34;background:#12161C;border-radius:14px;padding:28px;display:flex;flex-direction:column;gap:18px;position:sticky;top:112px}
.days{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:8px}
.days button,.slots button{font-family:'IBM Plex Mono',monospace;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:#B9BFB6;background:transparent;border:1px solid #262C34;border-radius:8px;padding:12px 6px;cursor:pointer;line-height:1.4}
.days button b{display:block;font-size:16px;color:#E7ECEF;font-weight:500;letter-spacing:0}
.days button.on,.slots button.on{border-color:#C6F24E;color:#0E1116;background:#C6F24E}
.days button.on b{color:#0E1116}
.slots{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px}
.f{display:flex;flex-direction:column;gap:8px}
.f input,.f textarea{font-family:'IBM Plex Mono',monospace;font-size:13px;color:#E7ECEF;background:#0E1116;border:1px solid #262C34;border-radius:8px;padding:12px 14px;outline:none;width:100%;box-sizing:border-box}
.f input:focus,.f textarea:focus{border-color:#939A96}
.f textarea{min-height:90px;resize:vertical}
.confirm{display:none;flex-direction:column;gap:14px}
.cal.done .confirm{display:flex}.cal.done .live{display:none}
.btnp{font-family:'IBM Plex Mono',monospace;font-weight:500;font-size:12px;letter-spacing:.12em;text-transform:uppercase;padding:16px 24px;border-radius:8px;background:#C6F24E;color:#0E1116;border:0;cursor:pointer}
/* Selected work — the index: CMS rows, a cursor-following measured card, in-place expansion, live filters */
.cidx{position:relative}
.cidx .filters{display:flex;flex-wrap:wrap;gap:8px;justify-content:flex-end}
.cidx .filters button{font-family:'IBM Plex Mono',monospace;font-size:11px;letter-spacing:.12em;text-transform:uppercase;padding:10px 14px;border-radius:8px;border:1px solid #262C34;background:transparent;color:#939A96;cursor:pointer;transition:color .25s,border-color .25s,background .25s}
.cidx .filters button b{font-weight:500;color:#B9BFB6;margin-left:7px}
.cidx .filters button:hover{color:#E7ECEF;border-color:#B9BFB6}
.cidx .filters button.on{background:#E7ECEF;color:#0E1116;border-color:#E7ECEF}
.cidx .filters button.on b{color:#545A60}
.cidx .rows{border-top:1px solid #262C34;margin-top:40px}
.cidx .cw{display:grid;grid-template-rows:1fr;transition:grid-template-rows .55s cubic-bezier(.2,.8,.2,1),opacity .35s}
.cidx .cw.hide{grid-template-rows:0fr;opacity:0;pointer-events:none}
.cidx .cw>div{overflow:hidden;min-height:0}
.cidx .cx{position:relative;border-bottom:1px solid #262C34}
.cidx .cx:after{content:"";position:absolute;left:0;right:0;bottom:-1px;height:1px;background:#C6F24E;transform:scaleX(0);transform-origin:left;transition:transform .55s cubic-bezier(.2,.8,.2,1)}
.cidx .cx:hover:after,.cidx .cx.open:after{transform:scaleX(1)}
.cidx .head{display:grid;grid-template-columns:56px 1.55fr 190px 1fr 150px 40px;gap:22px;align-items:center;padding:26px 0;cursor:pointer;-webkit-tap-highlight-color:transparent;user-select:none}
.cidx .head .n{font-family:'IBM Plex Mono',monospace;font-size:12px;letter-spacing:.14em;color:#939A96;transition:color .3s}
.cidx .head .t{font-size:30px;font-weight:600;letter-spacing:-.035em;line-height:1.1;color:#E7ECEF;transition:transform .5s cubic-bezier(.2,.8,.2,1)}
.cidx .head .d,.cidx .head .s{font-family:'IBM Plex Mono',monospace;font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#939A96;line-height:1.5}
.cidx .head .s{white-space:nowrap}
.cidx .head .m{font-family:'IBM Plex Mono',monospace;font-size:12px;line-height:1.5;color:#B9BFB6}
.cidx .head .m b{font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:22px;letter-spacing:-.03em;color:#E7ECEF;margin-right:8px}
.cidx .head .p{width:34px;height:34px;border:1px solid #262C34;border-radius:8px;display:flex;align-items:center;justify-content:center;font-family:'IBM Plex Mono',monospace;font-size:16px;color:#939A96;justify-self:end;transition:transform .45s cubic-bezier(.2,.8,.2,1),color .3s,border-color .3s}
.cidx .cx:hover .head .n{color:#C6F24E}
.cidx .cx:hover .head .t{transform:translateX(14px)}
.cidx .cx.open .head .t{transform:none}
.cidx .head .p i{font-style:normal;display:block;transition:transform .45s cubic-bezier(.2,.8,.2,1)}
.cidx .cx.open .head .p{color:#E7ECEF;border-color:#B9BFB6}
.cidx .cx.open .head .p i{transform:rotate(45deg)}
.cidx .body{display:grid;grid-template-rows:0fr;transition:grid-template-rows .6s cubic-bezier(.2,.8,.2,1)}
.cidx .cx.open .body{grid-template-rows:1fr}
.cidx .body>div{overflow:hidden;min-height:0}
.cidx .bi{display:grid;grid-template-columns:56px 1fr 1fr 300px;gap:22px 28px;padding:4px 0 38px;opacity:0;transform:translateY(10px);transition:opacity .45s .12s,transform .45s .12s}
.cidx .cx.open .bi{opacity:1;transform:none}
.cidx .bi .k{font-family:'IBM Plex Mono',monospace;font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#939A96;margin-bottom:8px}
.cidx .bi p{margin:0;font-size:15px;line-height:24px;color:#B9BFB6}
.cidx .bi p+ .k{margin-top:18px}
.cidx .bi .chips{display:flex;flex-wrap:wrap;gap:6px;margin-top:18px}
.cidx .bi .chips span{font-family:'IBM Plex Mono',monospace;font-size:11px;letter-spacing:.06em;color:#B9BFB6;border:1px solid #262C34;border-radius:6px;padding:6px 9px}
.cidx .meas{background:#F7F8F4;color:#0E1116;border-radius:12px;padding:22px 24px;display:flex;flex-direction:column;gap:6px;align-self:start}
.cidx .meas .k,.peek .k{font-family:'IBM Plex Mono',monospace;font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:#545A60}
.cidx .meas .v,.peek .v{font-size:44px;font-weight:600;letter-spacing:-.045em;line-height:1;color:#3F6B1F;font-variant-numeric:tabular-nums}
.cidx .meas .l,.peek .l{font-size:13px;line-height:19px;color:#3C424A}
.cidx .bars,.peek .bars{display:flex;align-items:flex-end;gap:16px;height:70px;margin-top:14px;border-bottom:1px solid #D6DAD2}
.cidx .bars i,.peek .bars i{display:block;width:36px;background:#D6DAD2;transform-origin:bottom;transform:scaleY(0);transition:transform .9s cubic-bezier(.2,.8,.2,1) .1s}
.cidx .bars i.on,.peek .bars i.on{background:#3F6B1F}
.cidx .cx.open .bars i,.peek.show .bars i{transform:scaleY(1)}
.cidx .bl,.peek .bl{display:flex;gap:16px;font-family:'IBM Plex Mono',monospace;font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:#545A60;margin-top:8px}
.cidx .bl span,.peek .bl span{width:36px;text-align:center;white-space:nowrap}
.cidx .bars.none,.cidx .bl.none,.peek .bars.none,.peek .bl.none{display:none}
.cidx .ask{font-family:'IBM Plex Mono',monospace;font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#3F6B1F;text-decoration:none;margin-top:8px;padding:8px 0;display:inline-block}
.cidx .foot{display:flex;justify-content:space-between;align-items:flex-end;gap:40px;margin-top:28px}
.peek{position:fixed;left:0;top:0;width:264px;pointer-events:none;z-index:40;transform:translate3d(-9999px,-9999px,0);will-change:transform}
.peek .in{background:#F7F8F4;color:#0E1116;border-radius:12px;padding:20px 22px;display:flex;flex-direction:column;gap:6px;transform:scale(.94) translateY(10px);opacity:0;transition:transform .32s cubic-bezier(.2,.8,.2,1),opacity .25s}
.peek.show .in{transform:none;opacity:1}
@media (hover:none){.peek{display:none}.cidx .cx:hover .head .t{transform:none}}
@media (prefers-reduced-motion:reduce){.peek{display:none}.cidx .cx .head .t,.cidx .cw,.cidx .body,.cidx .bi,.cidx .bars i{transition:none}}
/* Notes — the journal: one feature, a ledger of the rest. Authored in dark tokens; varify() makes it tone-aware */
.notes .jn{display:grid;grid-template-columns:1.15fr 1fr;gap:72px;margin-top:52px;align-items:start}
.notes .feat{display:flex;flex-direction:column;gap:18px;padding-top:26px;border-top:2px solid #E7ECEF;text-decoration:none;color:#E7ECEF;position:relative}
.notes .feat:before{content:"";position:absolute;left:0;top:-2px;height:2px;width:100%;background:#C6F24E;transform:scaleX(0);transform-origin:left;transition:transform .6s cubic-bezier(.2,.8,.2,1)}
.notes .feat:hover:before{transform:scaleX(1)}
.notes .feat .k{display:flex;gap:14px;font-family:'IBM Plex Mono',monospace;font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#939A96}
.notes .feat .k b{font-weight:500;color:#C6F24E}
.notes .feat h3{margin:0;font-size:42px;font-weight:600;letter-spacing:-.045em;line-height:1.04;max-width:14ch;color:#E7ECEF}
.notes .feat p{margin:0;font-size:17px;line-height:29px;color:#B9BFB6;max-width:520px}
.notes .feat .r{margin-top:6px;font-family:'IBM Plex Mono',monospace;font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#C6F24E;display:inline-flex;align-items:center;gap:8px}
.notes .r i{font-style:normal;display:inline-block;transition:transform .45s cubic-bezier(.2,.8,.2,1)}
.notes .feat:hover .r i,.notes .row:hover .r i{transform:translateX(6px)}
.notes .ledger{border-top:1px solid #262C34;padding-top:2px}
.notes .row{display:grid;grid-template-columns:40px 1fr auto;gap:18px;align-items:baseline;padding:22px 0;border-bottom:1px solid #262C34;text-decoration:none;color:#E7ECEF;position:relative}
.notes .row:after{content:"";position:absolute;left:0;right:0;bottom:-1px;height:1px;background:#C6F24E;transform:scaleX(0);transform-origin:left;transition:transform .55s cubic-bezier(.2,.8,.2,1)}
.notes .row:hover:after{transform:scaleX(1)}
.notes .row .n{font-family:'IBM Plex Mono',monospace;font-size:11px;letter-spacing:.14em;color:#939A96;transition:color .3s}
.notes .row:hover .n{color:#C6F24E}
.notes .row .t{font-size:21px;font-weight:600;letter-spacing:-.03em;line-height:1.2;color:#E7ECEF;transition:transform .5s cubic-bezier(.2,.8,.2,1)}
.notes .row:hover .t{transform:translateX(10px)}
.notes .row .c{display:block;margin-top:6px;font-family:'IBM Plex Mono',monospace;font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#939A96}
.notes .row .r{font-family:'IBM Plex Mono',monospace;font-size:14px;color:#939A96}
.notes .ledger .all{display:flex;justify-content:space-between;align-items:center;padding-top:20px;font-family:'IBM Plex Mono',monospace;font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#939A96}
.notes .ledger .all a{color:#C6F24E;text-decoration:none;display:inline-block;padding:8px 0}
.notes a:focus-visible{outline:2px solid #C6F24E;outline-offset:4px}
@media (prefers-reduced-motion:reduce){.notes .feat:before,.notes .row:after,.notes .row .t,.notes .r i{transition:none}}
/* Industries index: the ledger, one row per industry */
.ilist{border-top:1px solid #262C34}
.irow{display:grid;grid-template-columns:52px 1.5fr 1fr 110px 40px;gap:22px;align-items:center;padding:26px 0;border-bottom:1px solid #262C34;text-decoration:none;color:#E7ECEF;position:relative}
.irow:after{content:"";position:absolute;left:0;right:0;bottom:-1px;height:1px;background:#C6F24E;transform:scaleX(0);transform-origin:left;transition:transform .55s cubic-bezier(.2,.8,.2,1)}
.irow:hover:after{transform:scaleX(1)}
.irow .n{font-family:'IBM Plex Mono',monospace;font-size:12px;letter-spacing:.14em;color:#939A96;transition:color .3s}
.irow:hover .n{color:#C6F24E}
.irow .t{display:block;font-size:30px;font-weight:600;letter-spacing:-.035em;line-height:1.1;transition:transform .5s cubic-bezier(.2,.8,.2,1)}
.irow:hover .t{transform:translateX(14px)}
.irow .s{display:block;margin-top:8px;font-size:15px;line-height:23px;color:#939A96;max-width:520px}
.irow .m{font-family:'IBM Plex Mono',monospace;font-size:12px;line-height:1.5;color:#B9BFB6}
.irow .m b{font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:22px;letter-spacing:-.03em;color:#E7ECEF;margin-right:8px}
.irow .c{font-family:'IBM Plex Mono',monospace;font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#939A96;white-space:nowrap}
.irow .r{width:34px;height:34px;border:1px solid #262C34;border-radius:8px;display:flex;align-items:center;justify-content:center;font-family:'IBM Plex Mono',monospace;font-size:16px;color:#939A96;justify-self:end;transition:transform .45s cubic-bezier(.2,.8,.2,1),color .3s}
.irow:hover .r{transform:translateX(6px);color:#C6F24E}
@media (prefers-reduced-motion:reduce){.irow:after,.irow .t,.irow .r{transition:none}}
.fl{display:block;font-size:14px;line-height:1.5;padding:4px 0;color:#B9BFB6;text-decoration:none;transition:color .25s}.fl:hover{color:#E7ECEF}
.art{max-width:680px}.art p{margin:0 0 22px;font-size:18px;line-height:30px;color:#B9BFB6}.art h2{margin:40px 0 14px;font-size:26px;font-weight:600;letter-spacing:-.03em;line-height:1.2}.art ol{margin:0 0 22px;padding-left:22px;font-size:18px;line-height:30px;color:#B9BFB6}.art li{margin-bottom:8px}.art .pq{margin:34px 0;padding:22px 26px;border-left:2px solid #C6F24E;font-size:24px;font-weight:600;letter-spacing:-.03em;line-height:1.3;color:#E7ECEF}
.cmp{border-top:1px solid #262C34}.cmp>div{display:grid;grid-template-columns:170px repeat(4,minmax(0,1fr));gap:20px;padding:18px 0;border-bottom:1px solid #262C34;font-size:14px;line-height:22px;color:#B9BFB6}.cmp>div>span:first-child{font-family:'IBM Plex Mono',monospace;font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#939A96;padding-top:4px}.cmp>div>span:last-child{color:#E7ECEF}.cmp .hd{font-family:'IBM Plex Mono',monospace;font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#939A96}.cmp .hd span:last-child{color:#C6F24E}
.brief .f{display:flex;flex-direction:column;gap:10px}.brief input,.brief textarea{width:100%;box-sizing:border-box;background:transparent;border:1px solid #262C34;border-radius:8px;padding:13px 14px;color:#E7ECEF;font-family:'IBM Plex Mono',monospace;font-size:13px;outline:none}.brief textarea{min-height:120px;resize:vertical}.brief input:focus,.brief textarea:focus{border-color:#C6F24E}.brief .lbl{font-family:'IBM Plex Mono',monospace;font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#939A96;margin-top:8px}.brief .chips2{display:flex;flex-wrap:wrap;gap:8px}.brief .chips2 button{font-family:'IBM Plex Mono',monospace;font-size:11px;letter-spacing:.1em;text-transform:uppercase;padding:9px 12px;border-radius:8px;border:1px solid #262C34;background:transparent;color:#939A96;cursor:pointer}.brief .chips2 button.on{background:#E7ECEF;color:#0E1116;border-color:#E7ECEF}
.legal{max-width:760px}.legal h2{margin:44px 0 12px;font-size:22px;font-weight:600;letter-spacing:-.025em}.legal p,.legal li{font-size:16px;line-height:27px;color:#B9BFB6}.legal ul{padding-left:20px;margin:0 0 16px}.legal p{margin:0 0 16px}
/* Agentic flow */
.flow .node rect{transition:stroke .25s,fill .25s}
.flow .node:hover rect,.flow .node:focus rect,.flow .node.on rect{stroke:var(--acc)}
.flow .node{cursor:pointer;outline:none}
.flist .frow{display:grid;grid-template-columns:44px 170px 1fr 1fr 1fr 1fr;gap:18px;align-items:start;padding:20px 0;border-bottom:1px solid #262C34;font-size:14px;line-height:22px;color:#B9BFB6;transition:background .25s}
.flist .frow.on{background:#12161C}
.flist .frow .n{font-family:'IBM Plex Mono',monospace;font-size:11px;letter-spacing:.12em;color:#C6F24E}
.flist .frow .t{font-size:19px;font-weight:600;letter-spacing:-.02em;color:#E7ECEF;line-height:1.2}
.flist .frow .a{font-family:'IBM Plex Mono',monospace;font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:#939A96;margin-top:6px}
.flist .frow .k{display:block;font-family:'IBM Plex Mono',monospace;font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:#939A96;margin-bottom:4px}
.list.nolime i{background:#262C34}
'''

TONE_CSS = '''
body{background:#0E1116}
.tone-d{--bg:#0E1116;--text:#E7ECEF;--dim:#939A96;--sub:#B9BFB6;--line:#262C34;--panel:#12161C;--hair:#1C222B;--acc:#C6F24E;--btn:#C6F24E;--btnText:#0E1116;--seamdot:#454C55;--dot:#1C222B;background:var(--bg);color:var(--text)}
.tone-l{--bg:#F7F8F4;--text:#0E1116;--dim:#545A60;--sub:#3C424A;--line:#D6DAD2;--panel:#FFFFFF;--hair:#EAECE6;--acc:#3F6B1F;--btn:#0E1116;--btnText:#F7F8F4;--seamdot:#A9AFA6;--dot:#D9DECF;background:var(--bg);color:var(--text)}
'''

EXTRA_JS = r'''

    // reveal fallback: anything already scrolled past the 85% line is shown, even if the observer missed it during a fast scroll
    var rvLeft = qa('.rv');
    var rvSweep = function () {
      if (!rvLeft.length) return;
      var line = window.innerHeight * .85, keep = [];
      rvLeft.forEach(function (el) { if (el.classList.contains('in')) return; if (el.getBoundingClientRect().top < line) el.classList.add('in'); else keep.push(el); });
      rvLeft = keep;
    };
    window.addEventListener('scroll', rvSweep, { passive: true }); setTimeout(rvSweep, 300);

    qa('a[href="#"]').forEach(function (a) { a.addEventListener('click', function (e) { e.preventDefault(); }); });

    var bf = q('#bf');
    if (bf) {
      qa('#bWhen button').forEach(function (b) { b.addEventListener('click', function () { qa('#bWhen button').forEach(function (o) { o.classList.toggle('on', o === b); }); }); });
      q('#briefBtn').addEventListener('click', function () { var em = q('#bEmail').value || '[your email]'; if (!q('#bWhat').value) { q('#bWhat').focus(); return; } q('#bMail').textContent = em; bf.classList.add('done'); });
    }

    var dds = qa('.hdr .dd');
    dds.forEach(function (d) {
      var a = q('a.nl', d);
      a.addEventListener('click', function (e) { if (window.matchMedia && window.matchMedia('(hover: none)').matches && !d.classList.contains('open')) { e.preventDefault(); dds.forEach(function (o) { o.classList.remove('open'); }); d.classList.add('open'); } });
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') dds.forEach(function (o) { o.classList.remove('open'); }); });
    document.addEventListener('click', function (e) { if (!e.target.closest('.hdr .dd')) dds.forEach(function (o) { o.classList.remove('open'); }); });

    var fl = q('.flow');
    if (fl) {
      var nodes = qa('.flow .node'), frows = qa('.flist .frow');
      var mark = function (i) { nodes.forEach(function (n, j) { n.classList.toggle('on', j === i); }); frows.forEach(function (r, j) { r.classList.toggle('on', j === i); }); };
      nodes.forEach(function (n, i) { n.addEventListener('mouseenter', function () { mark(i); }); n.addEventListener('focus', function () { mark(i); }); n.addEventListener('click', function () { frows[i].scrollIntoView({ behavior: rm ? 'auto' : 'smooth', block: 'center' }); }); });
      frows.forEach(function (r, i) { r.addEventListener('mouseenter', function () { mark(i); }); });
      fl.addEventListener('mouseleave', function () { mark(-1); });
    }

    // ---- selected work: the index (CMS rows) ----
    var cidx = q('#cidx');
    if (cidx) {
      var cdata = {}; try { JSON.parse(q('#caseData').textContent).forEach(function (c) { cdata[c._id] = c; }); } catch (e) {}
      var crows = qa('.cx', cidx), cwraps = qa('.cw', cidx), fbtns = qa('.filters button', cidx), peek = q('#peek');
      var cnt = null;
      var countTo = function (el, str) {
        var m = /^([0-9]+(?:\.[0-9]+)?)(.*)$/.exec(str || '');
        if (!m || rm) { el.textContent = str; return; }
        var n = parseFloat(m[1]), suf = m[2], dec = (m[1].split('.')[1] || '').length, t0 = performance.now();
        if (cnt) cancelAnimationFrame(cnt);
        var step = function (t) { var k = Math.min(1, (t - t0) / 900); k = 1 - Math.pow(1 - k, 3); el.textContent = (n * k).toFixed(dec) + suf; if (k < 1) cnt = requestAnimationFrame(step); };
        cnt = requestAnimationFrame(step);
      };
      var fillMeasure = function (root, c, animate) {
        var v = q('.v', root), l = q('.l', root), bars = q('.bars', root), bl = q('.bl', root), mt = c.metric || {};
        if (animate) countTo(v, mt.value); else v.textContent = mt.value || '';
        l.textContent = mt.label || '';
        var has = mt.before !== null && mt.before !== undefined && mt.after !== null && mt.after !== undefined;
        bars.classList.toggle('none', !has); bl.classList.toggle('none', !has);
        if (has) {
          var mx = Math.max(mt.before, mt.after, 1);
          bars.innerHTML = '<i style="height:' + Math.max(4, mt.before / mx * 100) + '%"></i><i class="on" style="height:' + Math.max(4, mt.after / mx * 100) + '%"></i>';
          bl.innerHTML = '<span>' + (mt.beforeLabel || 'Before') + '</span><span>' + (mt.afterLabel || 'After') + '</span>';
        }
      };
      // expansion (one open at a time)
      crows.forEach(function (r) {
        q('.head', r).addEventListener('click', function () {
          var was = r.classList.contains('open');
          crows.forEach(function (o) { o.classList.remove('open'); q('.head', o).setAttribute('aria-expanded', 'false'); });
          if (!was) {
            r.classList.add('open'); q('.head', r).setAttribute('aria-expanded', 'true');
            var c = cdata[r.getAttribute('data-id')]; if (c) fillMeasure(q('.meas', r), c, true);
            if (peek) peek.classList.remove('show');
          }
        });
        q('.head', r).addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); q('.head', r).click(); } });
      });
      // filters: rows collapse and re-stagger in
      fbtns.forEach(function (b) {
        b.addEventListener('click', function () {
          var f = b.getAttribute('data-f'), k = 0;
          fbtns.forEach(function (o) { o.classList.toggle('on', o === b); });
          crows.forEach(function (o) { o.classList.remove('open'); });
          cwraps.forEach(function (w) { var on = f === 'all' || w.getAttribute('data-dom') === f; w.style.transitionDelay = on ? (k++ * 45) + 'ms' : '0ms'; w.classList.toggle('hide', !on); });
        });
      });
      // cursor-following measured card (fine pointers only)
      var fine = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches && !rm;
      if (fine && peek) {
        var px = 0, py = 0, tx = 0, ty = 0, lx = 0, rot = 0, showing = false, praf = null;
        var place = function () {
          px += (tx - px) * .13; py += (ty - py) * .13;
          var vel = tx - lx; lx = tx; rot += (Math.max(-9, Math.min(9, vel * .3)) - rot) * .12;
          var vw = window.innerWidth, x = px + 24; if (x + 280 > vw) x = px - 288;
          peek.style.transform = 'translate3d(' + x.toFixed(1) + 'px,' + (py - 24).toFixed(1) + 'px,0) rotate(' + rot.toFixed(2) + 'deg)';
          if (showing || Math.abs(tx - px) > .4 || Math.abs(ty - py) > .4) praf = requestAnimationFrame(place); else praf = null;
        };
        cidx.addEventListener('mousemove', function (e) { tx = e.clientX; ty = e.clientY; if (!praf) praf = requestAnimationFrame(place); });
        crows.forEach(function (r) {
          r.addEventListener('mouseenter', function () {
            if (r.classList.contains('open')) return;
            var c = cdata[r.getAttribute('data-id')]; if (!c) return;
            fillMeasure(peek, c, true);
            if (!showing) { px = tx; py = ty; lx = tx; }
            showing = true; peek.classList.add('show'); if (!praf) praf = requestAnimationFrame(place);
          });
          r.addEventListener('mouseleave', function () { showing = false; peek.classList.remove('show'); });
        });
        cidx.addEventListener('mouseleave', function () { showing = false; peek.classList.remove('show'); });
      }
    }

    // ---- core services: the file (stacked sticky spec sheets) ----
    var file = q('#file');
    if (file) {
      var fcards = qa('.sheet', file), legend = qa('.legend i', file), TAB = 46, TOP = 88;
      fcards.forEach(function (c, i) { c.style.top = (TOP + i * TAB) + 'px'; c.style.zIndex = String(10 + i); });
      var fSize = function () { var mx = 0; fcards.forEach(function (c, i) { c.style.minHeight = ''; mx = Math.max(mx, c.offsetHeight + i * TAB); }); fcards.forEach(function (c, i) { c.style.minHeight = (mx - i * TAB) + 'px'; }); var sur = file.closest('.tone-l'), nxt = sur && sur.nextElementSibling, endEl = fcards[fcards.length - 1], dw = q('.dwell', file); if (nxt && nxt.classList.contains('over') && dw) { nxt.style.marginTop = '-' + (endEl.offsetHeight + dw.offsetHeight + 22 - 200) + 'px'; } };
      fSize();
      var fTick = function () {
        var y = window.scrollY || window.pageYOffset, active = 0;
        fcards.forEach(function (c, i) {
          var r = c.getBoundingClientRect(), stuck = r.top <= TOP + i * TAB + 1;
          if (stuck) active = i;
          var nx = fcards[i + 1];
          if (nx) {
            var nr = nx.getBoundingClientRect(), cover = Math.max(0, Math.min(1, (r.bottom - nr.top) / (r.height - TAB)));
            c.style.transform = rm ? '' : 'scale(' + (1 - cover * .025) + ')';
            var vl = q('.veil', c); if (vl) vl.style.opacity = String(cover * .45);
            c.classList.toggle('stacked', nr.top <= TOP + (i + 1) * TAB + 1);
          } else { c.style.transform = ''; c.classList.remove('stacked'); }
        });
        legend.forEach(function (l, i) { l.classList.toggle('on', i <= active); });
      };
      this.onFile = function () { if (!self.ft) { self.ft = true; requestAnimationFrame(function () { self.ft = false; fTick(); }); } };
      window.addEventListener('scroll', this.onFile, { passive: true }); window.addEventListener('resize', function () { fSize(); self.onFile(); });
      fcards.forEach(function (c, i) {
        var tb = q('.tab', c); if (!tb) return;
        tb.addEventListener('click', function (ev) {
          if (ev.target.closest('a')) return;
          var y = c.getBoundingClientRect().top + (window.scrollY || window.pageYOffset) - (TOP + i * TAB);
          window.scrollTo({ top: y, behavior: rm ? 'auto' : 'smooth' });
        });
      });
      fTick();
    }
    // ---- inner-page extras (feature-detected) ----
    var est = q('#est');
    if (est) {
      var eng = q('#eng'), mon = q('#mon'), oE = q('#oEng'), oM = q('#oMon'), oD = q('#oDays'), oC = q('#oCost'), rate = parseInt(self.props.dayRate || 0, 10) || 0;
      var upd = function () {
        var e = parseInt(eng.value, 10), m = parseInt(mon.value, 10), days = e * m * 21;
        oE.textContent = e + (e === 1 ? ' engineer' : ' engineers'); oM.textContent = m + ' months'; oD.textContent = days.toLocaleString() + ' engineer-days';
        oC.textContent = rate ? (rate * days).toLocaleString() + ' at ' + rate.toLocaleString() + ' / day' : days.toLocaleString() + ' &#215; your day rate';
        if (!rate) oC.innerHTML = days.toLocaleString() + ' &times; [YOUR RATE]';
      };
      eng.addEventListener('input', upd); mon.addEventListener('input', upd); upd();
    }
    qa('.faq').forEach(function (f) {
      var its = qa('.item', f);
      its.forEach(function (it, i) { it.addEventListener('click', function () { var wasOn = it.classList.contains('on'); its.forEach(function (o, j) { o.classList.toggle('on', j === i && !wasOn); }); }); });
    });
    var cal = q('#cal');
    if (cal) {
      var names = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], mons = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      var d = new Date(); var day = d.getDay(); var add = ((8 - day) % 7) || 7; d.setDate(d.getDate() + add); // next Monday
      var days = q('#days'), slots = q('#slots'), sum = q('#sum'), pick = { d: null, t: null };
      var i, dd = [];
      for (i = 0; i < 5; i++) { var x = new Date(d); x.setDate(d.getDate() + i); dd.push(x); }
      days.innerHTML = dd.map(function (x, i) { return '<button data-d="' + i + '">' + names[x.getDay()] + '<b>' + x.getDate() + '</b>' + mons[x.getMonth()] + '</button>'; }).join('');
      var times = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30'];
      slots.innerHTML = times.map(function (t) { return '<button data-t="' + t + '">' + t + '</button>'; }).join('');
      var refresh = function () {
        qa('#days button').forEach(function (b) { b.classList.toggle('on', pick.d !== null && parseInt(b.getAttribute('data-d'), 10) === pick.d); });
        qa('#slots button').forEach(function (b) { b.classList.toggle('on', b.getAttribute('data-t') === pick.t); });
        if (pick.d !== null && pick.t) { var x = dd[pick.d]; sum.textContent = names[x.getDay()] + ' ' + x.getDate() + ' ' + mons[x.getMonth()] + ' · ' + pick.t + ' GMT · 30 min · with Hopsig'; }
        else sum.textContent = 'Pick a day and a time (GMT).';
      };
      days.addEventListener('click', function (ev) { var b = ev.target.closest('button'); if (!b) return; pick.d = parseInt(b.getAttribute('data-d'), 10); refresh(); });
      slots.addEventListener('click', function (ev) { var b = ev.target.closest('button'); if (!b) return; pick.t = b.getAttribute('data-t'); refresh(); });
      q('#confirmBtn').addEventListener('click', function () {
        var em = q('#fEmail').value || '[your email]';
        if (pick.d === null || !pick.t) { sum.textContent = 'Pick a day and a time first.'; return; }
        q('#cWhen').textContent = sum.textContent; q('#cMail').textContent = em; cal.classList.add('done');
      });
      refresh();
    }
'''

NAV_OF = {"Home": None, "Services": "Services", "Industries": "Industries", "Agentic": "AI transformation", "Flow": "Agentic flow", "Work": "Company", "Approach": "Company", "Notes": "Company", "Join": "Company", "Working": "Company", "Agencies": "Company", "Rates": "Rates", "Book": None, "Brief": None, "Privacy": None, "Terms": None, "404": None}
def _mi(href, n, name, desc, cur):
    return ('<a class="mi' + (' on' if href == cur else '') + '" href="' + href + '"><span class="n">' + n + '</span><span><b>' + name + '</b>' + (('<span class="d">' + desc + '</span>') if desc else '') + '</span></a>')
def header(active):
    cur = TONE.get("file"); top = NAV_OF.get(active, active)
    A = lambda n: ' on' if n == top else ''
    nl = lambda n, f, extra='': '<a class="nl' + A(n) + '" href="' + f + '" style="text-decoration: none; font-family: ' + MONO + '; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: ' + DIM + ';">' + n + extra + '</a>'
    car = '<span class="crt" aria-hidden="true">&#9662;</span>'
    svc = '<div class="menu wide"><div class="pnl">' + ''.join(_mi(SVC_FILES[i], str(i + 1).zfill(2), SERVICES[i][0], SERVICES[i][1], cur) for i in range(8)) + '<div class="mf"><a href="SITE_Services.dc.html">All eight, and the three ways we work &#8594;</a><a href="SITE_Rates.dc.html">Rates &#8594;</a></div></div></div>'
    ind = '<div class="menu"><div class="pnl">' + ''.join(_mi(IND_FILES[i], str(i + 1).zfill(2), IND[i]["name"], IND[i]["facts"][0][0] + ' &#183; ' + IND[i]["facts"][0][1], cur) for i in range(6)) + '<div class="mf"><a href="SITE_Industries.dc.html">All six &#8594;</a></div></div></div>'
    co_items = [("SITE_Work.dc.html", "Work", "32 case notes, client names withheld"), ("SITE_Approach.dc.html", "Approach", "How we staff, run and measure an account"), ("SITE_Notes.dc.html", "Notes", "Things we would say on the call anyway"), ("SITE_Working.dc.html", "Working with us", "Contracts, IP, data, security, invoicing"), ("SITE_Agencies.dc.html", "For agencies", "White-label delivery under your brand"), ("SITE_Join.dc.html", "Join", "Senior only, and what that means"), ("SITE_Compare.dc.html", "Why not just hire?", "The honest table")]
    co = '<div class="menu"><div class="pnl">' + ''.join(_mi(f, str(i + 1).zfill(2), n, d, cur) for i, (f, n, d) in enumerate(co_items)) + '</div></div>'
    links = ('<div class="dd">' + nl("Services", "SITE_Services.dc.html", car) + svc + '</div>'
             '<div class="dd">' + nl("Industries", "SITE_Industries.dc.html", car) + ind + '</div>'
             + nl("AI transformation", "SITE_Agentic.dc.html") + nl("Agentic flow", "SITE_Flow.dc.html") +
             '<div class="dd">' + nl("Company", "SITE_Approach.dc.html", car) + co + '</div>'
             + nl("Rates", "SITE_Rates.dc.html"))
    return ('<header id="hdr" class="hdr' + ('' if active == "Home" else ' always') + '"><div class="wrap" style="height: 72px; display: flex; align-items: center; justify-content: space-between;">'
            '<a href="SITE_Home.dc.html" style="text-decoration: none; display: flex; align-items: center;">' + lockup(26, TEXT, LIME) + '</a>'
            '<nav style="display: flex; align-items: center; gap: 26px;">' + links +
            (('<a href="' + BOOK + '" class="cta" style="text-decoration: none; font-family: ' + MONO + '; font-weight: 500; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; padding: 12px 17px; border-radius: 8px; background: transparent; color: ' + TEXT + '; box-shadow: inset 0 0 0 1px ' + LINE + ';">Book a consult</a>') if active != "Book" else '') + '</nav></div></header>')

def footer():
    cols = [("Services", [(SERVICES[i][0], SVC_FILES[i]) for i in range(8)]),
            ("Industries", [(IND[i]["name"], IND_FILES[i]) for i in range(6)]),
            ("Company", [("Approach", "SITE_Approach.dc.html"), ("Work", "SITE_Work.dc.html"), ("Notes", "SITE_Notes.dc.html"), ("AI transformation", "SITE_Agentic.dc.html"), ("Agentic flow", "SITE_Flow.dc.html"), ("For agencies", "SITE_Agencies.dc.html"), ("Join", "SITE_Join.dc.html"), ("Working with us", "SITE_Working.dc.html"), ("Rates", "SITE_Rates.dc.html")]),
            ("Start", [("Book a consult", "SITE_Book.dc.html"), ("Send a brief", "SITE_Brief.dc.html"), ("Why not just hire?", "SITE_Compare.dc.html"), ("Privacy", "SITE_Privacy.dc.html"), ("Terms", "SITE_Terms.dc.html")])]
    grid = ''.join('<div><div style="font-family: ' + MONO + '; font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: ' + DIM + '; margin-bottom: 14px;">' + h + '</div>' + ''.join('<a class="fl" href="' + f + '">' + n + '</a>' for n, f in links) + '</div>' for h, links in cols)
    return ('<footer id="foot" style="border-top: 1px solid ' + HAIR + ';"><div class="wrap" style="padding-top: 56px; padding-bottom: 36px;"><div style="display: grid; grid-template-columns: 1.2fr repeat(4, minmax(0, 1fr)); gap: 40px; align-items: start;"><div style="display: flex; flex-direction: column; gap: 18px;">' + lockup(20, TEXT, LIME) +
            '<div style="font-size: 14px; line-height: 22px; color: ' + DIM + '; max-width: 240px;">Senior engineers and data/AI people who join your team, or take the build end to end.</div>' + btn("Book a consult", "outline", BOOK) + '</div>' + grid + '</div>'
            '<div style="margin-top: 48px; padding-top: 22px; border-top: 1px solid ' + HAIR + '; display: flex; justify-content: space-between; gap: 24px; font-family: ' + MONO + '; font-size: 11px; color: ' + DIM + ';"><span>Hopsig Technologies &#183; Lahore, Pakistan &#183; [COMPANY REG NO.]</span><span>&#169; [YEAR] &#183; hopsig.com &#183; [HELLO@HOPSIG.COM]</span></div></div></footer>')

def closing(eyebrow="Fortnightly &#183; your call", title="Thirty minutes, and you will know whether we can help."):
    return ('<section class="close"><canvas id="closeCanvas" aria-hidden="true" data-tone="' + TONE["t"] + '"></canvas><div class="c">' + lab(eyebrow, LIME) +
            '<h2 style="margin: 0; font-size: 56px; font-weight: 600; line-height: 1.05; letter-spacing: -0.045em; max-width: 760px;">' + title + '</h2>'
            '<p style="margin: 0; max-width: 560px; font-size: 17px; line-height: 29px; color: ' + SUB + ';">Bring the problem, not a brief. If it is outside what we do well, we will say which of our contacts to call instead.</p>'
            '<div style="display: flex; align-items: center; gap: 14px; margin-top: 8px;">' + btn("Book a consult", "lime", BOOK) + btn("See our work", "outline", WORK).replace("background: transparent;", "background: " + INK + ";") + '</div><span style="font-family: ' + MONO + '; font-size: 12px; color: ' + DIM + ';">Or email [HELLO@HOPSIG.COM] &#8212; reply within one working day.</span></div></section>')

def page_hero(eyebrow, title, sub, chips=None, size=72):
    return ('<section class="ph"><canvas id="heroCanvas" aria-hidden="true" data-drift="1"></canvas><div class="wrap c" style="display: flex; flex-direction: column; gap: 24px;">' + lab(eyebrow, LIME) +
            '<h1 style="margin: 0; font-size: ' + str(size) + 'px; font-weight: 600; line-height: 1.02; letter-spacing: -0.05em; max-width: 900px;">' + title + '</h1>'
            '<p style="margin: 0; max-width: 640px; font-size: 19px; line-height: 31px; color: ' + SUB + ';">' + sub + '</p>' + (('<div class="chips">' + ''.join('<a class="chip2" href="' + h + '">' + t + '</a>' for t, h in chips) + '</div>') if chips else '') + '</div></section>')

def wrap(html, active):
    css = varify(B.CSS + EXTRA_CSS) + TONE_CSS
    html = html.replace("Book a 30-minute call", "Book a consult")
    html = restore(varify(html)); hdr = varify(header(active)); ftr = varify(footer())
    for a, b in [("Karachi", "Lahore"), ("Ten years each. No juniors on your account, ever.", "Shipped to production for years, not months. No juniors on your account, ever."), ("Only what a founder has shipped to production", "Only what we have shipped to production"), ("only what a founder has shipped to production", "only what we have shipped to production")]:
        html = html.replace(a, b); ftr = ftr.replace(a, b)
    js = B.JS.replace("    // render loop", EXTRA_JS + "\n    // render loop")
    # inner pages: hero canvas drifts only (no ring), and there may be no #hero/#car/#track
    js = js.replace("var heroSec = q('#hero'), copy = q('#heroCopy'), hint = q('#heroHint'), rail = q('#heroRail');",
                    "var heroSec = q('#hero'), copy = q('#heroCopy'), hint = q('#heroHint'), rail = q('#heroRail'); var isHome = !!heroSec;")
    js = js.replace("    function onScroll() {\n      var y = window.scrollY || window.pageYOffset;\n      var H = heroSec.offsetHeight - vh();",
                    "    function onScroll() {\n      var y = window.scrollY || window.pageYOffset;\n      if (!isHome) { return; }\n      var H = heroSec.offsetHeight - vh();")
    js = js.replace("      if (y < absTop(heroSec) + heroSec.offsetHeight) hero.draw(t);", "      if (isHome ? (y < absTop(heroSec) + heroSec.offsetHeight) : (heroC && heroC.getBoundingClientRect().bottom > 0)) hero.draw(t);")
    js = js.replace("    var hero = new Field(heroC, { cy: .5, p: 0 });", "    var hero = heroC ? new Field(heroC, { cy: .5, p: 0 }) : { draw: function () {}, resize: function () {}, p: 0 };")
    js = js.replace("this.ry = this.rx * .34;", "this.ry = this.rx * (this.o.ryk || .34);")
    js = js.replace("    var close = new Field(closeC, { cy: .5, p: 1 }); close.p = 1; close.rot = .6;", "    var close = closeC ? new Field(closeC, { cy: .5, p: 1, ryk: .56 }) : { draw: function () {}, resize: function () {} }; close.p = 1; close.rot = .6;")
    js = js.replace("      var r = closeC.getBoundingClientRect();\n      if (r.top < vh() && r.bottom > 0) close.draw(t);", "      if (closeC) { var r = closeC.getBoundingClientRect(); if (r.top < vh() && r.bottom > 0) close.draw(t); }")
    js = js.replace("    qa('[data-go]').forEach(function (b) {", "    if (car) qa('[data-go]').forEach(function (b) {")
    js = js.replace("      this.c = canvas; this.ctx = canvas.getContext('2d'); this.o = opts;", "      this.c = canvas; this.ctx = canvas.getContext('2d'); this.o = opts; this.light = canvas.getAttribute('data-tone') === 'l'; this.dotRGB = this.light ? '110,117,121' : '147,154,150'; this.accRGB = this.light ? '63,107,31' : '198,242,78';")
    js = js.replace("ctx.fillStyle = 'rgba(147,154,150,' + alpha.toFixed(3) + ')';", "ctx.fillStyle = 'rgba(' + this.dotRGB + ',' + alpha.toFixed(3) + ')';")
    js = js.replace("ctx.fillStyle = on ? 'rgba(198,242,78,' + na + ')' : 'rgba(198,242,78,' + (na * .55) + ')'; ctx.fill();", "ctx.fillStyle = 'rgba(' + this.accRGB + ',' + (on ? na : na * .55) + ')'; ctx.fill();")
    js = js.replace("ctx.strokeStyle = 'rgba(198,242,78,' + (na * .6) + ')';", "ctx.strokeStyle = 'rgba(' + this.accRGB + ',' + (na * .6) + ')';")
    js = js.replace("    var beats = qa('#seq .beat'), sts = qa('#seq .st');\n    if (window.IntersectionObserver) {", "    var beats = qa('#seq .beat'), sts = qa('#seq .st');\n    if (window.IntersectionObserver) {\n      if (beats.length) {")
    js = js.replace("      beats.forEach(function (b) { self.io.observe(b); });\n", "      beats.forEach(function (b) { self.io.observe(b); });\n      }\n")
    js = js.replace("      beats[0].classList.add('on'); sts[0].classList.add('on'); qa('.rv')", "      if (beats.length) { beats[0].classList.add('on'); sts[0].classList.add('on'); } qa('.rv')")
    js = js.replace("var q = function (s) { return document.querySelector(s); };", "var q = function (s, r) { return (r || document).querySelector(s); };")
    js = js.replace("var qa = function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };", "var qa = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };")
    props = '{"dayRate":{"editor":"int","default":0,"min":0,"max":2000,"step":10,"section":"Rates"},"$preview":{"width":1440,"height":900}}'
    return ('<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<title>Hopsig — ' + {"Book": "Book a consult", "Home": "You think it. We finish it."}.get(active, active) + '</title>\n<script src="./support.js"></script>\n</head>\n<body>\n<x-dc>\n<helmet>\n<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap">\n<style>' + css + '</style>\n</helmet>\n'
            '<div class="pg tone-d" style="width: 100%; min-height: 100vh; position: relative;">' + hdr + html + ftr + '</div>\n</x-dc>\n<script type="text/x-dc" data-dc-script data-props=\'' + props + '\'>' + js + '</script>\n</body>\n</html>\n')

# ------------------------------------------------------------------ HOME
def home():
    TONE["t"] = "d"; hero = B.hero().replace("Senior engineers and data/AI people who join your team, or take the build end to end. Two founders, ten years each, and nobody junior on your account.", "We integrate directly with your team to deliver high-stakes software and AI products from architecture to production launch.").replace("Engineering &amp; data teams &#183; UK, US, EU", "Fractional engineering, data &amp; AI teams")
    a = hero.index('<div style="display: flex; align-items: center; gap: 14px; margin-top: 6px;">'); z = hero.index('<div class="cap">')
    facts = '<div style="display: flex; align-items: center; gap: 22px; margin-top: 22px; font-family: ' + MONO + '; font-size: 12px; letter-spacing: 0.04em; color: ' + DIM + ';">' + ''.join(('<span style="width: 1px; height: 12px; background: ' + LINE + ';"></span>' if i else '') + '<span><span style="color: ' + TEXT + ';">' + v + '</span> ' + k + '</span>' for i, (v, k) in enumerate([("Principal-level", "talent"), ("10 days", "to deployment"), ("Daily", "overlap with your team"), ("Flexible", "terms")])) + '</div>'
    hero = hero[:a] + '<div style="display: flex; align-items: center; gap: 14px; margin-top: 6px;">' + btn("Book a consult", "lime", BOOK) + btn("See our work", "outline", WORK) + '</div>' + facts + '</div>' + hero[z:].replace(btn("See rates", "outline", "#book"), btn("See rates", "outline", "SITE_Rates.dc.html")).replace(btn("Book a 30-minute call"), btn("Book a 30-minute call", "lime", BOOK))
    TONE["t"] = "l"; car = B.carousel().replace('<div class="wrap head" style="display: flex; align-items: flex-end; justify-content: space-between;">' + h2("Three ways we work.", 52),
                               '<div class="wrap head" style="display: flex; align-items: flex-end; justify-content: space-between;"><div>' + h2("Three ways we work.", 52) + '<a href="SITE_Services.dc.html" class="more" style="display: inline-block; margin-top: 2px; text-decoration: none; font-family: ' + MONO + '; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: ' + LIME + ';">All services &#8594;</a></div>')
    mid = B.midcta().replace(btn("Book a 30-minute call"), btn("Book a 30-minute call", "lime", BOOK))
    TONE["t"] = "d"; hero_h = hero
    body = surface("d", hero_h, seam=False)
    body += surface("l", (TONE.__setitem__("t","l") or core_services()))
    body += surface("d", (TONE.__setitem__("t","d") or case_index()) + mid, cls="over")
    why = B.why().replace("Overlap that works", "Agentic delivery").replace("Four hours with GMT, every working day.", "Our own SDLC on Claude Code: planning, review, tests and docs automated, a person in the loop when it matters.")
    body += surface("l", (TONE.__setitem__("t","l") or ('<div style="height: 100px;"></div>' + B.marquee())) + why)
    body += surface("d", record())
    body += surface("l", (TONE.__setitem__("t","l") or notes()) + closing())
    return wrap(body, "Home")

def record():
    tiles = [("150+", "merchants and 100K+ transactions, four months after an embedded payments platform launched"), ("5&#215;", "repeat transactions from a loyalty engine built for enterprise retail"), ("98%", "detection accuracy from a computer-vision product working on field photographs"), ("60%", "less analysis time on preclinical data harmonised across global labs")]
    grid = ''.join('<div class="rv" style="transition-delay: ' + str(i * 80) + 'ms; border-top: 2px solid ' + (TEXT if i == 0 else LINE) + '; padding-top: 16px; display: flex; flex-direction: column; gap: 8px;"><div style="font-size: 44px; font-weight: 600; letter-spacing: -0.045em; line-height: 1;">' + n + '</div><div style="font-size: 14px; line-height: 22px; color: ' + DIM + ';">' + c + '</div></div>' for i, (n, c) in enumerate(tiles))
    return ('<section id="record" class="wrap" style="padding: 100px 0 120px;"><div style="display: flex; gap: 64px; align-items: flex-start;"><div class="rv" style="width: 440px; flex-shrink: 0; display: flex; flex-direction: column; gap: 20px;">' + lab("The record", LIME) + h2("Shipping to production since 2019.", 44) +
            '<p style="margin: 0; font-size: 17px; line-height: 29px; color: ' + SUB + ';">Payments, regulated healthcare, retail at scale, agentic delivery. Every system on the Work page was built, run or measured by us. Client names are withheld until the call; the numbers are not.</p><a href="' + WORK + '" class="more" style="text-decoration: none; font-family: ' + MONO + '; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: ' + LIME + ';">See the record &#8594;</a></div>'
            '<div style="flex-grow: 1; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 28px 26px; padding-top: 6px;">' + grid + '</div></div>'
            '<div class="rv" style="margin-top: 80px; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid ' + LINE + '; border-bottom: 1px solid ' + LINE + '; padding: 22px 0; font-family: ' + MONO + '; font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase; color: ' + DIM + ';">' + ''.join('<span>' + x + '</span>' for x in ["Established [YEAR]", "Lahore, Pakistan", "In production since 2019", "Built for teams in the UK, US and EU", "[COMPANY REG NO.]"]) + '</div></section>')

# ------------------------------------------------------------------ SERVICES
def services():
    S = [("embedded", "01 &#8212; Embedded", "Engineers inside your team", "Your standups, your board, your repo, your definition of done. We manage the person; you direct the work.",
          ["A named senior engineer, in your standup from day one", "Your tooling, your repo, your board &#8212; nothing of ours to adopt", "We manage performance, holidays and cover; you manage the work", "If it is not working, a replacement inside ten working days"],
          ["Scaling a team without a six-month hiring round", "A nine-month push with a hard date", "Covering a leaver while you hire properly"],
          "Monthly, per engineer", "from [YOUR RATE] / day &#183; 3-month minimum &#183; 30 days&#8217; notice", 2),
         ("built", "02 &#8212; Built", "A product, scoped and shipped", "A written scope, a fixed first increment, working software inside six weeks. Then we keep going or we hand it over.",
          ["A two-page SOW three days after the call: in, out, cost", "A fixed first increment, six weeks, in your cloud account", "A fortnightly review: shipped, slipped, cost against plan", "A handover pack: runbook, tests, a recorded walkthrough"],
          ["A new product or module with a deadline", "A rebuild the in-house team cannot fit in", "An MVP that has to survive its first customers"],
          "Fixed scope, per increment", "Quoted after the call &#183; NET 14 &#183; IP yours on payment", 1),
         ("data", "03 &#8212; Data &amp; AI", "Systems that stay correct", "Pipelines, warehouses, retrieval and evaluation harnesses. We measure the thing before we claim it improved.",
          ["Ingest and warehouse work that the in-house team can run after", "Retrieval and LLM features with an evaluation harness, not a demo", "Dashboards people stop arguing with", "A before-and-after measurement on every increment"],
          ["Reporting nobody trusts", "A nightly batch that is now a daily problem", "An AI feature that has to be right, not impressive"],
          "Project or retained", "from [YOUR RATE] / day &#183; retained from [MONTHLY]", 3)]
    TONE["t"] = "d"; hero_h = page_hero("Services", "Three ways we work.<br>One way we behave.", "Whichever you pick, you get the same people, the same scope-first habit and the same fortnightly review. The detail below is the detail we would put in the SOW.", [("Embedded", "#embedded"), ("Built", "#built"), ("Data &amp; AI", "#data")])
    TONE["t"] = "l"; html = '<div class="wrap">'
    for sid, k, t, p, gets, good, ptitle, pline, ph in S:
        html += ('<section id="' + sid + '" class="svc"><div class="rv" style="display: flex; flex-direction: column; gap: 22px;">' + lab(k, LIME) + h2(t, 44) + '<p style="margin: 0; font-size: 17px; line-height: 29px; color: ' + SUB + '; max-width: 560px;">' + p + '</p>'
                 '<div style="margin-top: 10px;">' + lab("What you get") + '<div class="list" style="margin-top: 10px;">' + ''.join('<div><i></i><span>' + g + '</span></div>' for g in gets) + '</div></div>'
                 '<div style="margin-top: 10px;">' + lab("Good for") + '<div style="margin-top: 10px; display: flex; flex-direction: column; gap: 6px; font-size: 15px; line-height: 1.55; color: ' + DIM + ';">' + ''.join('<div>&#8212; ' + g + '</div>' for g in good) + '</div></div></div>'
                 '<div class="ui rv">' + anim_panel(dark=True, mode="static", static_phase=ph, w=568, h=392, prefix="sv" + str(ph)) + '<div class="price">' + lab("Priced") + '<div style="font-size: 22px; font-weight: 600; letter-spacing: -0.03em;">' + ptitle + '</div><div style="font-family: ' + MONO + '; font-size: 12px; line-height: 1.7; color: ' + SUB + ';">' + pline + '</div><a href="SITE_Rates.dc.html" class="more" style="text-decoration: none; font-family: ' + MONO + '; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: ' + LIME + ';">See rates &#8594;</a></div></div></section>')
    html += services_index()
    tiles = [("Code review", "Every change reviewed by a second senior before it lands."), ("CI from day one", "Tests and a pipeline before the first feature, not after the first incident."), ("Runbooks", "On-call steps and rollback written as we go, in your wiki."), ("Documentation", "Decisions recorded where your team will find them."), ("Security basics", "Secrets, access, dependencies: handled, and listed in the handover."), ("Handover", "A recorded walkthrough and a week of questions answered, included.")]
    html += ('<section style="padding: 100px 0; border-top: 1px solid ' + HAIR + ';"><div class="rv" style="display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 36px;">' + h2("Inside every engagement.", 44) + lab("Not extras. Not line items.") + '</div><div class="tiles rv">' +
             ''.join('<div><div style="font-family: ' + MONO + '; font-size: 11px; color: ' + DIM + ';">0' + str(i + 1) + '</div><div style="font-size: 19px; font-weight: 600; letter-spacing: -0.02em;">' + a + '</div><div style="font-size: 14px; line-height: 22px; color: ' + DIM + ';">' + b + '</div></div>' for i, (a, b) in enumerate(tiles)) + '</div></section></div>')
    light_h = html
    TONE["t"] = "d"; html = '<div style="height: 100px;"></div>' + B.marquee()
    html += ('<section class="wrap" style="padding: 40px 0 140px;"><div class="rv" style="display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 36px;">' + h2("How an engagement runs.", 44) + '<a href="SITE_Home.dc.html" class="more" style="text-decoration: none; font-family: ' + MONO + '; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: ' + LIME + ';">See it play out &#8594;</a></div><div class="steps rv">' +
             ''.join('<div class="' + ('on' if i == 1 else '') + '">' + lab(d, LIME if i == 1 else DIM) + '<div style="font-size: 18px; font-weight: 600; letter-spacing: -0.02em;">' + n + '</div><div style="font-size: 14px; line-height: 22px; color: ' + DIM + ';">' + s + '</div></div>' for i, (d, n, s) in enumerate(BEATS)) + '</div></section>')
    dark_h = html
    TONE["t"] = "l"; close_h = closing("Services &#183; the call", "Tell us the problem. We will tell you which of the three it is.")
    return wrap(surface("d", hero_h, seam=False) + surface("l", light_h) + surface("d", dark_h) + surface("l", close_h), "Services")

# ------------------------------------------------------------------ APPROACH
def approach():
    TONE["t"] = "d"; hero_h = page_hero("Approach", "How we work.<br>The same way, every account.", "Scope before money. Senior only. Measured before we claim it improved. Easy to leave. Not values on a wall: clauses in the SOW, and habits you can check in the first fortnight.")
    cols = [("Senior only", "Everyone we put on your account has shipped to production for years, not months. There is no junior tier, so there is nobody to hide behind one."), ("No bench", "We staff for your engagement, not ahead of it. You meet the engineer before they start, and you can say no."), ("Replaced, not argued", "If it is not working inside the first month, a replacement is in your standup within ten working days.")]
    TONE["t"] = "l"; html = ('<div class="wrap" style="padding-top: 100px;"><section style="padding-bottom: 120px;"><div class="rv">' + h2("How we staff an account.", 44) + '</div><div style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 24px; margin-top: 40px;">' +
             ''.join('<div class="rv" style="transition-delay: ' + str(i * 90) + 'ms; border-top: 2px solid ' + (LIME if i == 0 else LINE) + '; padding-top: 18px; display: flex; flex-direction: column; gap: 10px;"><div style="font-size: 22px; font-weight: 600; letter-spacing: -0.03em;">' + a + '</div><div style="font-size: 15px; line-height: 25px; color: ' + DIM + ';">' + b + '</div></div>' for i, (a, b) in enumerate(cols)) + '</div></section>')
    stages = [("Plan", "The build is planned with a solutions-architect agent before anyone writes code. The plan is a document you can read and object to."), ("Stories", "Epics and stories are populated and tracked automatically, in your Jira or ours, so progress is visible without a status meeting."), ("Build", "Stories are implemented autonomously inside guardrails: your conventions, your boundaries, enforced on every change."), ("Review", "Automated review and generated tests run before a senior looks. A senior always looks."), ("Document", "Documentation is written as the code changes, so it is never a week behind and never a handover task."), ("Escalate", "When a decision needs a person, it is pushed to a phone with the context, and the pipeline waits.")]
    html += ('<section style="padding-bottom: 120px; display: grid; grid-template-columns: 1fr 1.15fr; gap: 64px; align-items: start;"><div class="rv" style="display: flex; flex-direction: column; gap: 20px; position: sticky; top: 100px;">' + lab("Agentic delivery", LIME) + h2("Our SDLC runs on Claude Code. A person signs every increment.", 44) +
             '<p style="margin: 0; font-size: 17px; line-height: 29px; color: ' + SUB + '; max-width: 520px;">We built the pipeline for a ten-engineer practice, where it is now the default path for new work. It is how every Hopsig build runs: the agents do the planning, the tests and the paperwork; the people do the judgement. Two Android apps scoped at five developers shipped with one, on the original timeline.</p>'
             '<div style="display: flex; flex-wrap: wrap; gap: 6px; margin-top: 4px;">' + ''.join('<span style="font-family: ' + MONO + '; font-size: 11px; letter-spacing: 0.06em; color: ' + SUB + '; border: 1px solid ' + LINE + '; border-radius: 6px; padding: 6px 9px;">' + c + '</span>' for c in ["Claude Code", "MCP servers", "Guardrails", "Automated review", "Test generation", "Living docs", "Human in the loop"]) + '</div><div style="display: flex; gap: 24px;"><a href="SITE_Flow.dc.html" class="more" style="text-decoration: none; font-family: ' + MONO + '; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: ' + LIME + ';">The flow &#8594;</a><a href="SITE_Agentic.dc.html" class="more" style="text-decoration: none; font-family: ' + MONO + '; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: ' + LIME + ';">The six-week offer &#8594;</a></div></div>'
             '<div style="border-top: 1px solid ' + LINE + ';">' + ''.join('<div class="rv" style="transition-delay: ' + str(i * 60) + 'ms; display: grid; grid-template-columns: 44px 150px 1fr; gap: 20px; align-items: baseline; padding: 20px 0; border-bottom: 1px solid ' + LINE + ';"><span style="font-family: ' + MONO + '; font-size: 11px; letter-spacing: 0.12em; color: ' + LIME + ';">' + str(i + 1).zfill(2) + '</span><span style="font-size: 20px; font-weight: 600; letter-spacing: -0.025em;">' + n + '</span><span style="font-size: 15px; line-height: 24px; color: ' + DIM + ';">' + d + '</span></div>' for i, (n, d) in enumerate(stages)) + '</div></section></div>')
    light_h = html; TONE["t"] = "d"; html = '<div style="height: 100px;"></div>'
    def bar(l, r, color, label_txt):
        return ('<div class="rv" style="display: grid; grid-template-columns: 200px 1fr; gap: 20px; align-items: center;"><div style="font-family: ' + MONO + '; font-size: 12px; color: ' + SUB + ';">' + label_txt + '</div><div class="ov"><i style="left: ' + str(l / 24 * 100) + '%; width: ' + str((r - l) / 24 * 100) + '%; background: ' + color + ';"></i></div></div>')
    axis = '<div style="display: grid; grid-template-columns: 200px 1fr; gap: 20px;"><div></div><div style="display: flex; justify-content: space-between; font-family: ' + MONO + '; font-size: 10px; letter-spacing: 0.1em; color: ' + DIM + ';">' + ''.join('<span>' + str(h).zfill(2) + '</span>' for h in range(0, 25, 3)) + '</div></div>'
    html += ('<section class="wrap" style="padding-bottom: 120px;"><div class="rv" style="display: flex; align-items: flex-end; justify-content: space-between;">' + h2("Where we are, when we are.", 44) + lab("All times GMT") + '</div>'
             '<div style="margin-top: 40px; display: flex; flex-direction: column; gap: 14px;">' + axis + bar(9, 17, "#3C424A", "London &#183; 09:00&#8211;17:00") + bar(4, 13, "#3C424A", "Lahore &#183; 09:00&#8211;18:00 local") + bar(9, 13, LIME, "Overlap &#183; 4 h, every day") + '</div>'
             '<div class="rv" style="margin-top: 28px; display: grid; grid-template-columns: 1fr 1fr; gap: 48px; font-size: 15px; line-height: 25px; color: ' + DIM + ';"><div>Four hours is enough for a standup, a review and a pairing session, and it is the same four hours every day, so nobody is doing it at midnight. For US teams we shift the day: <span style="color: ' + TEXT + ';">[OVERLAP WITH ET]</span> hours with Eastern time.</div><div>We are in Lahore, Pakistan. Delivery happens here, and the people who scope your work are the people who do it. Company details: <span style="color: ' + TEXT + ';">[COMPANY REG NO.]</span>, established <span style="color: ' + TEXT + ';">[YEAR]</span>.</div></div></section>')
    dark_h = html; TONE["t"] = "l"; close_h = closing("Approach &#183; the call", "The people who scope your work are the people who do it.")
    return wrap(surface("d", hero_h, seam=False) + surface("l", light_h) + surface("d", dark_h) + surface("l", close_h), "Approach")

# ------------------------------------------------------------------ RATES
def rates():
    R = [("Embedded", "[YOUR RATE]", "/ day, per engineer", "Billed monthly &#183; 21 days a month", ["Named senior engineer in your standup", "Your tooling, your repo, your board", "Performance, holidays and cover handled", "Replacement inside ten working days", "3-month minimum &#183; 30 days&#8217; notice"], False),
         ("Built", "[QUOTE]", "per increment", "Six weeks, fixed scope &#183; NET 14", ["Two-page SOW three days after the call", "Working software in your cloud account", "Fortnightly review with cost against plan", "Runbook, tests, recorded walkthrough", "IP yours on payment"], True),
         ("Data &amp; AI", "[YOUR RATE]", "/ day, or retained", "Retained from [MONTHLY] &#183; NET 14", ["Pipelines, warehouse, retrieval, evaluation", "Before-and-after measurement, every increment", "Runs without us afterwards", "Dashboards your team will actually use", "Project or rolling monthly"], False)]
    TONE["t"] = "d"; hero_h = page_hero("Rates", "Rates. On the page,<br>not after three calls.", "Every number below is the number on the SOW. If your problem does not fit one of the three shapes, the call is still thirty minutes and still free.")
    TONE["t"] = "l"; html = '<div class="wrap" style="padding-top: 100px;"><div style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 20px;">'
    for n, big, unit, sub, inc, hi in R:
        html += ('<div class="rate rv' + (' hi' if hi else '') + '">' + lab(n, LIME if hi else DIM) + '<div class="big">' + big + '<br><small>' + unit + '</small></div><div style="font-family: ' + MONO + '; font-size: 12px; color: ' + SUB + ';">' + sub + '</div><div class="list" style="margin-top: 6px;">' + ''.join('<div><i></i><span>' + x + '</span></div>' for x in inc) + '</div><div style="margin-top: auto; padding-top: 10px;">' + btn("Book a 30-minute call", "lime" if hi else "outline", BOOK) + '</div></div>')
    html += '</div>'
    html += ('<section id="est" class="est rv" style="margin-top: 100px;"><div>' + lab("Estimate an embedded team", LIME) + '<div style="font-size: 26px; font-weight: 600; letter-spacing: -0.03em; margin: 12px 0 28px;">Move the sliders. The number is the number.</div>'
             '<label><span>Engineers</span><span id="oEng">2 engineers</span></label><input id="eng" type="range" min="1" max="6" value="2"><label><span>Months</span><span id="oMon">6 months</span></label><input id="mon" type="range" min="3" max="12" value="6">'
             '<div style="font-size: 13px; line-height: 21px; color: ' + DIM + ';">21 working days a month. No onboarding fee, no recruiter fee, no notice-period buyout. Set the day rate in Tweaks to see a total. <a href="SITE_Compare.dc.html" style="color: ' + LIME + '; text-decoration: none;">Compare it with hiring &#8594;</a></div></div>'
             '<div class="out">' + lab("Engineer-days") + '<div class="n" id="oDays">252 engineer-days</div>' + lab("Total") + '<div class="n" id="oCost" style="font-size: 30px; color: ' + LIME + ';">&#8212;</div><div style="font-family: ' + MONO + '; font-size: 12px; line-height: 1.8; color: ' + DIM + '; margin-top: 8px;">Invoiced monthly in arrears &#183; GBP, USD or EUR<br>NET 14 &#183; 30 days&#8217; notice, either side</div></div></section>')
    terms = [("First engineer in", "10 working days"), ("Overlap with GMT", "4 hours, daily"), ("Minimum term", "3 months rolling"), ("Notice", "30 days, either side"), ("Invoicing", "Monthly, in arrears"), ("Payment", "NET 14 &#183; GBP / USD / EUR"), ("IP", "Yours, on payment"), ("NDA", "Ours or yours, before the scope"), ("Replacement", "Inside 10 working days"), ("Delivered from", "Karachi &#183; GMT+5")]
    html += '<div style="height: 120px;"></div></div>'
    light_h = html; TONE["t"] = "d"; html = '<div class="wrap">'
    html += ('<section style="padding: 100px 0 0;"><div class="rv" style="display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 24px;">' + h2("Terms.", 44) + lab("The whole list") + '</div><div class="terms rv">' + ''.join('<div><span>' + a + '</span><span>' + b + '</span></div>' for a, b in terms) + '</div></section>')
    faq = [("What if the engineer is not working out?", "Say so at the fortnightly review, or before. A replacement is in your standup inside ten working days, and you do not pay for the overlap."), ("Who owns the code?", "You do, on payment of each invoice. We keep nothing except what we have learned."), ("Do you work in our timezone?", "Four hours of overlap with GMT every working day, the same four hours, so it is predictable. US teams: we shift the day and agree the overlap in the SOW."), ("Can we start with one engineer?", "Yes. Most do. The minimum is one engineer for three months."), ("What is not included?", "Your cloud bill, third-party licences, and travel if you ask us to visit. Everything else on this page is included.")]
    html += ('<section class="wrap faq" style="padding: 100px 0 140px;"><div class="rv">' + h2("Questions we get on the call.", 44) + '</div><div style="margin-top: 32px; max-width: 800px;">' + ''.join('<div class="item rv"><div class="t"><span>' + q + '</span><span class="pl">+</span></div><div class="b">' + a + '</div></div>' for q, a in faq) + '<div style="border-top: 1px solid ' + LINE + ';"></div></div></section></div>')
    dark_h = html; TONE["t"] = "l"; close_h = closing("Rates &#183; the call", "If the numbers work, the next step is thirty minutes.")
    return wrap(surface("d", hero_h, seam=False) + surface("l", light_h) + surface("d", dark_h) + surface("l", close_h), "Rates")

# ------------------------------------------------------------------ WORK

RECORD = [  # the delivery record, written as the company record. No names, no employers.
    ("Fintech &#183; payments", "Embedded payments and stored-value wallet platform",
     "Merchants needed to take card, wallet and BNPL payments behind one integration, and onboarding could not depend on a manual review queue.",
     "Built from zero: self-serve onboarding with automated KYC document verification, KYC-verified adult and child wallets, subscription billing, PCI-DSS compliance, and fraud and anomaly detection across payments and reward balances. Checkout conversion was the metric; payment-method mix decided what got built next.",
     "<b>0 &#8594; 150+ merchants and 100K+ transactions in four months</b> of launch.",
     ["Payments", "KYC automation", "PCI-DSS", "BNPL", "Wallets", "Subscription billing"], "Built &#183; product-led"),
    ("Retail &#183; loyalty", "Loyalty and retention engine for enterprise retailers",
     "Enterprise retailers, including a Gulf property group, wanted repeat purchase without reward fraud eating the margin.",
     "Reward rules, tiers and gamification with fraud-risk mitigation designed in, across enterprise programmes on several continents.",
     "<b>Up to 5&#215; increase in repeat transactions.</b>",
     ["Loyalty", "Fraud detection", "Enterprise rollout"], "Built"),
    ("E-commerce &#183; growth", "Storefront and growth product",
     "A storefront that acquired customers but did not keep them.",
     "A/B and multivariate testing on the journey from first visit to repeat order; funnel instrumentation so every change was validated rather than asserted.",
     "<b>75% more repeat customers in two months</b>, alongside <b>40% monthly acquisition growth</b>.",
     ["Experimentation", "A/B testing", "Funnel instrumentation", "Mixpanel", "Amplitude"], "Built"),
    ("Retail &#183; AI", "Personalisation and image-search engine",
     "Recommendations and visual search that had to prove their return in the client&#8217;s numbers, not in a demo.",
     "Recommendation and image-search models with evaluation before release, production monitoring, retraining and version rollout owned end to end.",
     "<b>Up to 261&#215; client ROI.</b> Shipped an image-search model into production.",
     ["Recommendation systems", "Image search", "Evaluation gates", "Model monitoring"], "Data &amp; AI"),
    ("Retail &#183; omnichannel", "Inventory, POS and quick-commerce at scale",
     "Retailers across MENAP needed one stock position, a point of sale that worked in every store, and a mobile channel.",
     "Distributed inventory across retailers, a cloud POS, and a quick-commerce mobile app that powered a network reaching millions of small businesses.",
     "<b>Distributed inventory for 60+ retailers; cloud POS in 100+ locations; a mobile channel reaching 10M SMEs across MENAP.</b>",
     ["Inventory", "Cloud POS", "Mobile commerce", "Multi-country"], "Built"),
    ("AI &#183; delivery", "Agentic software-delivery framework on Claude Code",
     "An engineering practice wanted to deliver faster without losing review, tests and documentation along the way.",
     "An end-to-end pipeline on Claude Code: project planning, automated epic and story population with progress tracking, autonomous story implementation, a dedicated solutions-architect agent, guardrail enforcement, automated code review and test generation, living documentation, and human-in-the-loop escalation pushed to mobile when a decision needs a person.",
     "<b>Rolled out to 10 engineers and now the practice&#8217;s default path for new work.</b> Two Android apps scoped at five developers were shipped by one, on the original timeline.",
     ["Claude Code", "MCP servers", "Agent orchestration", "Guardrails", "Automated review", "Jira"], "Data &amp; AI"),
    ("Digital signage &#183; SaaS", "Multi-tenant digital signage platform, one engineer",
     "A company needed its own signage product: tenants, a CMS, a player it controlled, and devices that keep working offline.",
     "Multi-tenant backend and CMS, a custom Android (AOSP) player, offline-first device sync over MQTT, an MCP-based AI concierge, credit-based AI monetisation and a white-label reseller tier, on a lean deployment stack. Architected and built by one engineer.",
     "<b>Live in production with its first tenant, one of Lahore&#8217;s fastest-growing restaurant chains.</b>",
     ["Multi-tenant", "AOSP", "EMQX / MQTT", "MCP", "Vercel", "Railway", "Neon", "Cloudflare R2"], "Built"),
    ("Digital signage &#183; enterprise", "Signage platform across four continents",
     "A UK signage business operating across Australia, the US, China and APAC needed a platform its display-manufacturer partners could plug into.",
     ".NET 6 microservices and Angular on AWS (EKS, ECR, RDS, CloudWatch) with Docker-based CI/CD. Scheduled sync integrations with SharePoint, Power BI and partner sources. Production infrastructure stabilised under sustained memory pressure ahead of a database end-of-support migration.",
     "Shipped and running across four regions; partner integrations for three major display manufacturers &#8212; <span class=\"phx\">[ADD UPTIME / DEVICES]</span>.",
     [".NET 6", "Angular", "AWS EKS", "RDS", "Docker", "CI/CD", "Power BI", "SharePoint"], "Built &#183; embedded"),
    ("Healthcare &#183; regulated", "Health-insurance platform under supervision",
     "A regulated insurer needed a digital platform that a supervisor would sign off and a member could actually use.",
     "Mapped the underwriting and claims workflow before designing against it; balanced regulatory constraints against a usable member journey, from discovery to launch.",
     "Launched under regulatory supervision &#8212; <span class=\"phx\">[ADD MEMBERS / CLAIMS]</span>.",
     ["Regulated delivery", "Underwriting", "Claims", "Compliance"], "Built"),
    ("Healthcare &#183; telemedicine", "Online therapy platform, concept to public launch",
     "Remote therapy for marginalised communities: practitioners and patients, scheduling, consent, sessions.",
     "Practitioner and patient journeys, scheduling, consent and remote sessions, taken from concept to public launch.",
     "Publicly launched &#8212; <span class=\"phx\">[ADD SESSIONS / PRACTITIONERS]</span>.",
     ["Telemedicine", "Scheduling", "Consent", "Patient journeys"], "Built"),
    ("Healthcare &#183; IoT", "Preventive alerting in nursing homes",
     "Care staff found out too late. Sensors could tell them earlier, if the alerts were trusted.",
     "An IoT preventive-alerting product piloted and deployed across multiple nursing homes and validated in real care settings before scaling.",
     "Deployed across multiple homes &#8212; <span class=\"phx\">[ADD HOMES / ALERT PRECISION]</span>.",
     ["IoT", "Alerting", "Care settings", "Pilot to rollout"], "Data &amp; AI"),
    ("E-commerce &#183; AI", "LLM and RAG assistant in a live customer journey",
     "A UK deals platform had inbound support volume it could see in its tickets.",
     "An assistant sourced from support-ticket analysis rather than a feature request, embedded in the live journey, with quality gates before release.",
     "Reduced inbound support volume &#8212; <span class=\"phx\">[ADD THE NUMBER]</span>.",
     ["LLM", "RAG", "Quality gates", "Support analytics"], "Data &amp; AI"),
    ("Agritech &#183; computer vision", "Detection from user-submitted photographs",
     "Non-experts photographing in poor conditions; a model that had to act on what they sent.",
     "Owned the labelled dataset strategy, the evaluation criteria that gated release, production monitoring and the retraining loop as field data arrived; capture guidance and failure handling treated as part of the product. Localised for low-literacy users.",
     "<b>98% detection accuracy.</b> Government incubator funding secured on the minimum viable build.",
     ["Computer vision", "Dataset strategy", "Evaluation", "Retraining loop", "i18n"], "Data &amp; AI"),
    ("Platform &#183; APIs", "Developer platform exposing device telemetry",
     "A global hardware company wanted third parties building on its device telemetry through public APIs.",
     "Led the core API team: design, versioning, partner onboarding and documentation.",
     "Public API programme live with third-party partners &#8212; <span class=\"phx\">[ADD PARTNERS / CALLS]</span>.",
     ["Public APIs", "Versioning", "Partner onboarding", "Telemetry"], "Embedded"),
    ("Enterprise &#183; .NET", "Process-documentation platform backend",
     "A browser-extension product that writes process documentation from recorded sessions, with a milestone that could not slip.",
     "Owned Lambda and hosted worker services (SQS, SNS) across environments and led the refactor that shipped the critical milestone on deadline.",
     "Critical milestone shipped on the date.",
     [".NET", "AWS Lambda", "SQS / SNS", "Worker services"], "Embedded"),
    ("Retail &#183; integrations", "Retailer replenishment SDK",
     "Retailers integrating a replenishment service each failed in their own way.",
     ".NET Core microservices on Azure Service Fabric with EF Code First, plus an admin module that resolved SDK-level failures across retailer integrations.",
     "SDK in production across retailer integrations &#8212; <span class=\"phx\">[ADD RETAILERS]</span>.",
     [".NET Core", "Azure Service Fabric", "Microservices", "EF Core"], "Built"),
    ("Data &#183; ETL", "Marketing data consolidated into ML-ready datasets",
     "Marketing data scattered across sources, none of it ready for a model.",
     "An R&amp;D engagement on AWS Glue and Athena consolidating marketing data into ML-ready S3 datasets.",
     "ML-ready datasets delivered &#8212; <span class=\"phx\">[ADD SOURCES / VOLUME]</span>.",
     ["AWS Glue", "Athena", "S3", "ETL"], "Data &amp; AI"),
    ("Buildings &#183; IoT", "Real-time operational intelligence for 200+ buildings",
     "Building operators needed live operational data, not last month&#8217;s report.",
     "Product leadership of a telemetry platform delivering real-time operational intelligence across a large building estate.",
     "<b>Powering 200+ buildings.</b>",
     ["IoT telemetry", "Real-time", "Operations"], "Product"),
    ("AI &#183; small models", "Small language models where an LLM was too expensive",
     "An accuracy target that a large model met at a cost the business could not.",
     "Shipped a product on small language models as a cost-effective alternative, weighing accuracy against inference cost.",
     "Accuracy target met at a fraction of the inference cost &#8212; <span class=\"phx\">[ADD COST / ACCURACY]</span>.",
     ["SLMs", "Inference cost", "Evaluation"], "Data &amp; AI"),
    ("Enterprise &#183; automation", "Autonomous development pipeline for Dynamics 365",
     "Customising a CRM platform end to end without a team of specialists.",
     "Provisioned a full Dataverse environment and Azure AD app registration, then authored the project blueprint covering three MCP servers and plugin lifecycle management, letting an agent drive customisation end to end.",
     "Agent-driven customisation running end to end.",
     ["Dynamics 365", "Dataverse", "Azure AD", "MCP", "Claude Code"], "Data &amp; AI"),
]
# Case notes from the sister company's delivered work. No client names. Numbers only where the source states them.
CASES = [
    ("Healthcare", "Surgical imaging platform with automated analysis",
     "Surgeons and clinicians needed one workflow for patient imaging, with analysis that did not wait for a human to open every file.",
     "Two backends where each fits: Node.js/Express for workflow, Python/FastAPI for the models. Computer-vision analysis of medical images (OpenCV, TensorFlow). Role-based access and HIPAA-grade handling of patient data. PostgreSQL, imaging files on AWS S3, a real-time React front end.",
     "Workflow time and review backlog, before and after &#8212; <span class=\"phx\">[ADD THE NUMBER]</span>. Source states: workflow efficiency up, data fully secured.",
     ["Node.js", "Express", "FastAPI", "OpenCV", "TensorFlow", "PostgreSQL", "AWS S3", "React"], "Built"),
    ("Life sciences &#183; data", "Preclinical research portal for global labs",
     "Preclinical data was growing exponentially across labs and formats; nobody could compare it, let alone predict from it.",
     "A compliant cloud architecture with custom ETL to harmonise heterogeneous lab data. Machine-learning models for predicting therapeutic response and model relevance. Dashboards and real-time visualisation for researchers.",
     "<b>Data analysis time down 60%.</b> 100% of data visible across global teams. Predictive accuracy up.",
     ["Custom ETL", "Python", "ML models", "Cloud architecture", "Dashboards"], "Data &amp; AI"),
    ("Logistics", "Real-time freight dispatch and load board",
     "Dispatchers were assigning loads from stale data; delays and errors compounded through the day.",
     "WebSockets for instant load status, driver availability and assignments. Live vehicle tracking and route planning on Google Maps. A modular React load board with revenue and broker-performance analytics over GraphQL/Apollo.",
     "Dispatch delays and errors down &#8212; <span class=\"phx\">[ADD THE NUMBER]</span>. Source states: real-time accuracy, significantly fewer delays and errors.",
     ["React", "WebSockets", "GraphQL", "Apollo", "Google Maps API"], "Built"),
    ("Logistics &#183; mobile", "Transporter, driver and customer app",
     "Three very different users &#8212; a transporter running finances, a driver on the road, a customer waiting &#8212; sharing one product.",
     "iOS and Android app with a module per role: a transporter hub for loads, invoices and financial overview; a driver interface built for use in motion, with large targets and quick actions; customer visibility. A modular design system in Figma so the three stayed one product.",
     "Fleet coordination and customer visibility improved &#8212; <span class=\"phx\">[ADD THE NUMBER]</span>.",
     ["iOS", "Android", "Figma design system", "Data visualisation"], "Built"),
    ("Retail &#183; loyalty", "Omnichannel loyalty platform on microservices",
     "A loyalty programme that had to take high transaction volumes across channels without slowing the checkout.",
     "Microservices per loyalty function. Django REST Framework and React. AWS SQS/SNS for messaging, Celery for background work, Redis and Redshift caching for low-latency reads, OAuth for authentication, gRPC and GraphQL between services and clients.",
     "High transaction volumes at low latency &#8212; <span class=\"phx\">[ADD p95 AND VOLUME]</span>.",
     ["Django REST", "React", "AWS SQS/SNS", "Celery", "Redis", "Redshift", "OAuth", "gRPC", "GraphQL"], "Built"),
    ("Fintech", "P&amp;L forecasting engine with accounting integration",
     "Finance teams wanted forecasts they could trust and adjust, fed straight from their accounting data.",
     "A Django REST backend with secure APIs for data import, including a XERO integration. A hybrid model: time-series machine learning (SARIMA-class) combined with the team&#8217;s own formulas for P&amp;L projection. Built as a secure vault for sensitive projections.",
     "Forecast accuracy against actuals &#8212; <span class=\"phx\">[ADD THE NUMBER]</span>. Source states: production-ready, customisable, data-driven forecasts.",
     ["Django REST", "Python", "SARIMA", "XERO API", "PostgreSQL"], "Data &amp; AI"),
    ("AI systems", "Multi-agent orchestration framework",
     "Several independent AI agents had to work one objective together, reliably, not just in a demo.",
     "A Streamlit proof of concept first, to validate the idea in days. Then production: FastAPI backend, React front end, LangChain to define agent roles and collaboration flows, OpenAI and Groq models behind them.",
     "Coordinated workflow simulation among autonomous agents, reliably repeatable &#8212; <span class=\"phx\">[ADD RUNS / SUCCESS RATE]</span>.",
     ["FastAPI", "React", "LangChain", "OpenAI", "Groq", "Streamlit"], "Data &amp; AI"),
    ("Food &amp; hospitality", "Two brands, one ordering platform and admin",
     "A group running two restaurant brands wanted separate customer experiences and one back office.",
     "Distinct layouts and menus per brand under a shared design language. A single admin portal for orders, analytics and support across both. A complete design system in Figma so the third brand would be cheap.",
     "Ordering-journey conversion &#8212; <span class=\"phx\">[ADD BEFORE &#8594; AFTER]</span>. Source states: journey optimised for conversion; internal operations centralised.",
     ["Web UI/UX", "Admin portal", "Figma design system"], "Built"),
    ("Travel", "Rental, flights and community in one product",
     "A travel product with admins, influencers and hotel owners, three modules and an AI recommendation layer, needed a system before it needed screens.",
     "Complete user flows for Rental, Flights and Community. Role-specific journeys. AI-assisted trip discovery designed into the flows rather than bolted on. A design system for web and mobile handoff.",
     "Ready for multi-role management and rapid feature expansion &#8212; <span class=\"phx\">[ADD SHIP DATE / SCOPE]</span>.",
     ["System design", "Web &amp; mobile", "Design system", "AI recommendations"], "Built"),
    ("E-commerce &#183; analytics", "Funnel analysis and CRO for a large store",
     "A store with over Rs 95M in sales and thousands of orders did not know where the funnel leaked.",
     "Deep funnel analysis across 1.15M sessions to find drop-offs before checkout. Conversion-rate work at the points that mattered. A data foundation for budget allocation.",
     "<b>2.05% store conversion held at high traffic.</b> Average order value Rs 6,074. Over Rs 95M total sales analysed.",
     ["Shopify analytics", "Funnel analysis", "CRO"], "Data &amp; AI"),
    ("E-commerce &#183; growth", "Organic revenue engine for an online store",
     "A WooCommerce/Shopify store with almost no organic sales.",
     "Collection-based keyword targeting across product and category pages, AI-assisted content at scale, caching for fast checkout, and CRO on the checkout funnel.",
     "<b>Monthly revenue from $2,000 to $12,000 in six months</b> &#8212; 6&#215;, organic only.",
     ["WooCommerce", "Shopify", "Ahrefs", "Semrush", "WP Rocket"], "Growth"),
    ("Marketplace &#183; growth", "Inbound lead engine for a vehicle marketplace",
     "A UAE vehicle marketplace needed buyer and seller leads without buying every one.",
     "Intent-based keyword mapping, high-converting landing pages, and vehicle-listing schema for rich results across the Emirates.",
     "<b>500% growth in qualified inbound leads in six months</b> (audited). Top rankings for buyer and seller intent terms.",
     ["Technical SEO", "Schema markup", "Landing pages", "Ahrefs", "Semrush"], "Growth"),
]
DOMAINS = [
    ("Payments, wallets &amp; KYC", "An embedded payments platform: 0 to 150+ merchants and 100K+ transactions in four months, PCI-DSS, automated KYC.", ("F", 0)),
    ("Retail, loyalty &amp; e-commerce", "Loyalty at 5&#215; repeat transactions; personalisation at 261&#215; ROI; POS in 100+ locations; funnel work on a Rs 95M store.", ("F", 1)),
    ("Healthcare &amp; regulated", "A regulated health-insurance platform, a telemedicine launch, IoT alerting in nursing homes, a surgical imaging platform.", ("F", 8)),
    ("AI agents, RAG &amp; evaluation", "An agentic delivery framework on Claude Code, a multi-agent orchestration framework, RAG in a live journey, 98% computer vision.", ("F", 5)),
    ("Digital signage &amp; IoT", "A multi-tenant signage SaaS built by one engineer; an enterprise platform across four continents; telemetry for 200+ buildings.", ("F", 6)),
    ("Logistics &amp; platforms", "Real-time freight dispatch; a three-role transporter app; public telemetry APIs for a global hardware company.", ("C", 2)),
]
CASE_LINKS = {"Embedded payments and stored-value wallet platform": "SITE_Case_Payments.dc.html", "Preclinical research portal for global labs": "SITE_Case_Preclinical.dc.html", "Real-time freight dispatch and load board": "SITE_Case_Freight.dc.html"}
def case_card(i, dom, title, prob, did, meas, stack, shape):
    link = CASE_LINKS.get(title)
    return ('<div class="rv" style="transition-delay: ' + str((i % 2) * 90) + 'ms; border: 1px solid ' + LINE + '; background: ' + PANEL + '; border-radius: 14px; padding: 30px 32px; display: flex; flex-direction: column; gap: 16px;">'
            '<div style="display: flex; justify-content: space-between; align-items: baseline;">' + lab(str(i + 1).zfill(2) + " &#183; " + dom, LIME) + lab(shape) + '</div>'
            '<div style="font-size: 26px; font-weight: 600; letter-spacing: -0.03em; line-height: 1.2;">' + title + '</div>'
            '<div class="list">' + ''.join('<div><i></i><span><span style="color: ' + DIM + ';">' + a + ' &#8212; </span>' + b + '</span></div>' for a, b in [("Problem", prob), ("What we did", did), ("Measured", meas)]) + '</div>'
            '<div style="display: flex; flex-wrap: wrap; gap: 6px;">' + ''.join('<span style="font-family: ' + MONO + '; font-size: 11px; letter-spacing: 0.06em; color: ' + SUB + '; border: 1px solid ' + LINE + '; border-radius: 6px; padding: 6px 9px;">' + c + '</span>' for c in stack) + '</div>'
            '<div style="margin-top: auto; display: flex; justify-content: space-between; align-items: center; font-family: ' + MONO + '; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: ' + DIM + ';"><span>Client withheld &#183; details on the call</span><a href="' + (link or BOOK) + '" class="more" style="text-decoration: none; color: ' + LIME + ';">' + ("Read the case note &#8594;" if link else "Ask about this &#8594;") + '</a></div></div>')

def work():
    TONE["t"] = "d"; hero_h = page_hero("Work", "What we shipped.<br>What it measured.", "Case notes, not case studies: the problem, what we did, and the number that moved. Client names are withheld throughout. Every system here was built, run or measured by us, and any of them can be walked through on the call.", [("Book a consult", BOOK)])
    hero_h = hero_h.replace('<a class="chip2" href="' + BOOK + '">Book a consult</a>', btn("Book a consult", "lime", BOOK))
    TONE["t"] = "l"
    lead = RECORD[:8] + [CASES[1], CASES[0], CASES[4], CASES[10]]
    rest = [c for c in RECORD[8:]] + [c for c in CASES if c not in lead]
    html = '<div class="wrap" style="padding: 100px 0 120px;"><style>.phx{color:var(--acc);font-family:' + MONO + ';font-size:12px}</style>'
    html += '<div class="rv" style="display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 28px;">' + h2("Selected.", 44) + lab("Twelve with the numbers on them") + '</div>'
    html += '<div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 24px;">' + ''.join(case_card(i, *c) for i, c in enumerate(lead)) + '</div>'
    html += '<div class="rv" style="display: flex; align-items: flex-end; justify-content: space-between; margin: 100px 0 20px;">' + h2("The rest of the record.", 44) + lab(str(len(rest)) + " more &#183; ask for any of them on the call") + '</div><div style="border-top: 1px solid ' + LINE + ';">'
    for i, (dom, title, prob, did, meas, stack, shape) in enumerate(rest):
        html += ('<div class="rv" style="display: grid; grid-template-columns: 52px 1.1fr 1.6fr auto; gap: 20px; align-items: baseline; padding: 16px 0; border-bottom: 1px solid ' + LINE + ';"><span style="font-family: ' + MONO + '; font-size: 11px; letter-spacing: 0.12em; color: ' + LIME + ';">' + str(len(lead) + i + 1).zfill(2) + '</span>'
                 '<div><div style="font-size: 17px; font-weight: 600; letter-spacing: -0.02em;">' + title + '</div><div style="font-family: ' + MONO + '; font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: ' + DIM + '; margin-top: 4px;">' + dom + '</div></div>'
                 '<div style="font-size: 14px; line-height: 22px; color: ' + SUB + ';">' + meas + '</div>'
                 '<span style="font-family: ' + MONO + '; font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: ' + DIM + '; white-space: nowrap;">' + shape + '</span></div>')
    html += '</div></div>'
    light_h = html
    TONE["t"] = "d"; html = ('<section class="wrap" style="padding: 100px 0 120px; display: grid; grid-template-columns: 1fr 568px; gap: 64px; align-items: center;"><div class="rv" style="display: flex; flex-direction: column; gap: 20px;">' + lab("How we report", LIME) + h2("Measured before we claim it improved.", 44) +
             '<p style="margin: 0; font-size: 17px; line-height: 29px; color: ' + SUB + '; max-width: 520px;">Every case note above uses the same rule as every fortnightly review: a number from before, the same number from after, and the unit. Where the record only has the outcome in words, the number is marked to be added rather than invented.</p>'
             '<div class="list" style="max-width: 520px;"><div><i></i><span>Baseline taken in week one, in your environment</span></div><div><i></i><span>Same metric, same query, after the increment</span></div><div><i></i><span>Written into the review you sign, not a slide</span></div></div></div>'
             '<div class="rv">' + B.anim_panel(dark=True, mode="static", static_phase=3, w=568, h=392, prefix="wk") + '</div></section>')
    dark_h = html; TONE["t"] = "l"; close_h = closing("Work &#183; the call", "Bring the problem. We may have solved one like it.")
    return wrap(surface("d", hero_h, seam=False) + surface("l", light_h) + surface("d", dark_h) + surface("l", close_h), "Work")

# ------------------------------------------------------------------ SELECTED WORK (Home, section 3) — CMS-fed index
# Each entry mirrors a Sanity `caseStudy` document; the prototype renders the same shape from inline JSON.
FEATURED = [
    dict(id="payments", src=("F", 0), dom="payments", metric=dict(value="150+", label="merchants and 100K+ transactions, four months after launch", before=0, after=150, beforeLabel="Launch", afterLabel="Month 4")),
    dict(id="loyalty", src=("F", 1), dom="retail", metric=dict(value="5×", label="repeat transactions across enterprise loyalty programmes", before=100, after=500, beforeLabel="Before", afterLabel="After")),
    dict(id="personalisation", src=("F", 3), dom="retail", metric=dict(value="261×", label="client ROI, upper bound, from recommendation and image search", before=None, after=None)),
    dict(id="agentic", src=("F", 5), dom="ai", metric=dict(value="10", label="engineers on the agentic path; two apps scoped at five developers, shipped by one", before=5, after=1, beforeLabel="Scoped", afterLabel="Needed")),
    dict(id="omnichannel", src=("F", 4), dom="retail", metric=dict(value="100+", label="cloud POS locations; distributed inventory for 60+ retailers", before=None, after=None)),
    dict(id="preclinical", src=("C", 1), dom="health", metric=dict(value="60%", label="less analysis time on preclinical data across global labs", before=100, after=40, beforeLabel="Before", afterLabel="After")),
    dict(id="buildings", src=("F", 17), dom="iot", metric=dict(value="200+", label="buildings on one real-time operational telemetry platform", before=None, after=None)),
    dict(id="organic", src=("C", 10), dom="retail", metric=dict(value="6×", label="monthly revenue in six months, organic only", before=2000, after=12000, beforeLabel="$2K", afterLabel="$12K")),
]
DOMS = [("all", "All"), ("payments", "Payments"), ("retail", "Retail &amp; e-commerce"), ("health", "Healthcare &amp; data"), ("ai", "AI &amp; delivery"), ("iot", "IoT &amp; platforms")]

def case_index():
    import json as _json
    docs, rows = [], ''
    for i, f in enumerate(FEATURED):
        dom, title, prob, did, meas, stack, shape = (RECORD if f["src"][0] == "F" else CASES)[f["src"][1]]
        mt = f["metric"]
        docs.append({"_id": f["id"], "_type": "caseStudy", "domain": f["dom"], "metric": mt})
        rows += ('<div class="cw" data-dom="' + f["dom"] + '"><div><article class="cx rv" data-id="' + f["id"] + '" style="transition-delay: ' + str(i * 55) + 'ms;">'
                 '<div class="head" role="button" tabindex="0" aria-expanded="false"><span class="n">' + str(i + 1).zfill(2) + '</span><h3 class="t" style="margin: 0;">' + title + '</h3><span class="d">' + dom + '</span>'
                 '<span class="m"><b>' + mt["value"] + '</b>' + mt["label"].split(';')[0].split(',')[0] + '</span><span class="s">' + shape + '</span><span class="p" aria-hidden="true"><i>+</i></span></div>'
                 '<div class="body"><div><div class="bi"><div></div><div><div class="k">Problem</div><p>' + prob + '</p><div class="k" style="margin-top: 18px;">What we did</div><p>' + did + '</p></div>'
                 '<div><div class="k">Measured</div><p>' + meas + '</p><div class="chips">' + ''.join('<span>' + c + '</span>' for c in stack) + '</div></div>'
                 '<div class="meas"><div class="k">Measured</div><div class="v">' + mt["value"] + '</div><div class="l">' + mt["label"] + '</div><div class="bars none"></div><div class="bl none"></div><a class="ask" href="' + (CASE_LINKS.get(title) or BOOK) + '">' + ("Read the case note &#8594;" if CASE_LINKS.get(title) else "Ask about this &#8594;") + '</a></div></div></div></div></article></div></div>')
    counts = {k: sum(1 for f in FEATURED if f["dom"] == k) for k, _ in DOMS}; counts["all"] = len(FEATURED)
    filters = ''.join('<button data-f="' + k + '"' + (' class="on"' if k == "all" else '') + '>' + n + '<b>' + str(counts[k]) + '</b></button>' for k, n in DOMS)
    return ('<section id="cidx" class="cidx wrap" style="padding: 120px 0 130px;"><div class="rv" style="display: flex; align-items: flex-end; justify-content: space-between; gap: 40px;"><div style="display: flex; flex-direction: column; gap: 14px;">' + lab("Some of our work", LIME) + h2("Where we have done this before.", 48) +
            '<div style="font-family: ' + MONO + '; font-size: 12px; line-height: 1.7; color: ' + DIM + ';">Eight case notes, fetched from Sanity Studio. Hover a row for the number; open it for the note.</div></div><div class="filters" role="tablist" aria-label="Filter by domain">' + filters + '</div></div>'
            '<div class="rows">' + rows + '</div>'
            '<div class="foot rv"><a href="' + WORK + '" class="more" style="text-decoration: none; font-family: ' + MONO + '; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: ' + LIME + ';">All ' + str(len(RECORD) + len(CASES)) + ' case notes &#8594;</a>'
            '<div style="font-family: ' + MONO + '; font-size: 11px; line-height: 1.7; color: ' + DIM + '; max-width: 620px; text-align: right;">Build note: rows render from <span style="color: ' + SUB + ';">*[_type == "caseStudy" &amp;&amp; featured] | order(order asc)</span> via @sanity/client; the inline JSON below mirrors that response, so the swap is one fetch.</div></div>'
            '<div id="peek" class="peek" aria-hidden="true"><div class="in"><div class="k">Measured</div><div class="v"></div><div class="l"></div><div class="bars none"></div><div class="bl none"></div></div></div>'
            '<script type="application/json" id="caseData">' + _json.dumps(docs, ensure_ascii=False) + '</script></section>')

# ------------------------------------------------------------------ NOTES (Home, under The record) — CMS-fed journal
# Each entry mirrors a Sanity `post` document. Sample posts are opinion pieces in the site's voice, not claims; no dates or read times are invented.
POSTS = [
    dict(slug="superintelligence-is-not-on-your-roadmap", page="SITE_Note_Agents.dc.html", cat="Delivery", title="Superintelligence is not on your roadmap. Agents are.", excerpt="The word is everywhere this month. Here is what it changes for a sixty-person engineering team: nothing, and one thing."),
    dict(slug="the-sow-is-the-pitch", page="SITE_Note_SOW.dc.html", cat="Scope", title="The SOW is the sales pitch.", excerpt="Two pages, three days after the call, before any money changes hands. What goes in, what we leave out on purpose, and why the out list is the part a CTO reads twice."),
    dict(slug="eval-harness-before-the-demo", cat="AI", title="An eval harness before the demo.", excerpt="How we decide an LLM feature actually got better, and what a number looks like before a chat window does."),
    dict(slug="what-a-person-still-signs", cat="Delivery", title="What a person still signs in an agentic pipeline.", excerpt="Six stages run on Claude Code. Where the human sits, and why that seat is the one we refuse to automate."),
    dict(slug="four-hours-is-enough", cat="Working together", title="Four hours of overlap is enough. Here is the day.", excerpt="A standup, a review and a pairing session fit inside 09:00–13:00 GMT. What happens in the other four, and what never does."),
    dict(slug="the-number-before-the-claim", cat="Measurement", title="The number before the claim.", excerpt="Why every fortnightly review starts with a baseline taken in week one, in your environment, with your query."),
]

def notes():
    import json as _json
    docs = [{"_id": p["slug"], "_type": "post", "slug": {"current": p["slug"]}, "title": p["title"], "excerpt": p["excerpt"], "category": p["cat"], "publishedAt": None} for p in POSTS]
    f = POSTS[0]
    feat = ('<a class="feat rv" href="SITE_Note_Agents.dc.html" aria-label="Read: ' + f["title"] + '"><div class="k"><b>Latest</b><span>' + f["cat"] + '</span></div><h3>' + f["title"] + '</h3><p>' + f["excerpt"] + '</p><span class="r">Read the note <i>&#8594;</i></span></a>')
    rows = ''.join('<a class="row rv" href="' + p.get("page", "SITE_Notes.dc.html") + '" style="transition-delay: ' + str(80 + i * 70) + 'ms;" aria-label="Read: ' + p["title"] + '"><span class="n">' + str(i + 2).zfill(2) + '</span><span><span class="t" style="display: inline-block;">' + p["title"] + '</span><span class="c">' + p["cat"] + '</span></span><span class="r"><i>&#8594;</i></span></a>' for i, p in enumerate(POSTS[1:]))
    return ('<section id="notes" class="notes wrap" style="padding: 120px 0 110px;"><div class="rv" style="display: flex; align-items: flex-end; justify-content: space-between; gap: 40px;"><div style="display: flex; flex-direction: column; gap: 14px;">' + lab("Notes", LIME) + h2("Things we would say on the call anyway.", 44, TEXT, "640px") +
            '<div style="font-family: ' + MONO + '; font-size: 12px; line-height: 1.7; color: ' + DIM + ';">Short and opinionated, written by the people doing the work. Fetched from Sanity Studio.</div></div>'
            '<div style="font-family: ' + MONO + '; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: ' + DIM + '; white-space: nowrap;">' + str(len(POSTS)) + ' notes &#183; no newsletter, no pop-up</div></div>'
            '<div class="jn">' + feat + '<div class="ledger rv" style="transition-delay: 60ms;">' + rows + '<div class="all"><span>Everything else we have written</span><a href="SITE_Notes.dc.html">All notes &#8594;</a></div></div></div>'
            '<div class="rv" style="margin-top: 36px; font-family: ' + MONO + '; font-size: 11px; line-height: 1.7; color: ' + DIM + ';">Build note: the feature and the ledger render from <span style="color: ' + SUB + ';">*[_type == "post" &amp;&amp; defined(publishedAt)] | order(publishedAt desc)[0...5]{title, slug, excerpt, category, publishedAt}</span>; dates come from the document at build time, so none are shown here.</div>'
            '<script type="application/json" id="postData">' + _json.dumps(docs, ensure_ascii=False) + '</script></section>')

# ------------------------------------------------------------------ SERVICE PAGES (one per core service)
SVC_FILES = ["SITE_S1_Custom.dc.html", "SITE_S2_Team.dc.html", "SITE_S3_Data.dc.html", "SITE_S4_AI.dc.html", "SITE_S5_Cloud.dc.html", "SITE_S6_Legacy.dc.html", "SITE_S7_Mobile.dc.html", "SITE_S8_QA.dc.html"]
SVC = [
    dict(title="Products built<br>end to end.",
         gets=["A two-page SOW three days after the call: what is in, what is out, what it costs", "A fixed first increment: six weeks, working software in your cloud account", "A fortnightly review you sign: shipped, slipped, cost against plan", "A handover pack: runbook, tests, a recorded walkthrough, a week of questions answered"],
         no=["The deadline, the scope and the budget are all fixed and none of them can move", "You want a team that builds whatever the spec says and never pushes back"],
         steps=[("Day 0", "The call", "You describe the product. We say whether we are right for it and roughly what it costs."), ("Day 3", "The scope", "Two pages: in, out, cost, acceptance criteria. Before you pay anything."), ("Day 10", "First commit", "Repo, CI and environments in your cloud account; the first slice of the product under way."), ("Week 6", "First increment live", "Working software your users can touch, measured against the baseline."), ("Fortnightly", "The review", "Continue, change course or hand over. Your call, every fortnight.")],
         record=[("F", 0), ("F", 6), ("C", 2)],
         faq=[("Who owns the code?", "You do, on payment of each invoice. It lives in your repo and your cloud account from day one, so there is nothing to transfer."), ("What if the scope changes halfway through?", "It will. Changes go into the next increment, with the cost written down at the fortnightly review, so the first increment still lands on its date."), ("Can you work with our in-house engineers?", "Yes, and we prefer it. They review our pull requests and we review theirs; the handover is shorter because nothing is new to them.")],
         close="Tell us what you want built. We will tell you what it costs."),
    dict(title="Senior engineers<br>inside your team.",
         gets=["A named senior engineer, in your standup from day one, on your repo and your board", "You meet the engineer before they start, and you can say no", "We manage performance, holidays and cover; you direct the work", "If it is not working, a replacement inside ten working days, and you do not pay for the overlap"],
         no=["You need a junior to clear the tickets nobody else wants", "You want someone to be managed rather than someone who manages themselves"],
         steps=[("Day 0", "The call", "What the team is building, what is slowing it down, and what good looks like in three months."), ("Day 3", "Profiles, not a bench", "One or two named engineers, with the systems they have shipped. You interview them; you can say no."), ("Day 10", "In your standup", "Access, first commit, first review. Your tooling, your definition of done."), ("Fortnightly", "The review", "What landed, what slipped, what to change. A fifteen-minute call."), ("30 days", "Notice, either side", "No argument, no buyout, no recruiter fee if you later hire them.")],
         record=[("F", 7), ("F", 13), ("F", 14)],
         faq=[("How senior is senior?", "Years shipping to production, not years in the industry. Every engineer we place has owned a system in production and can show you which one."), ("Which timezone do they work in?", "Four hours of overlap with GMT every working day, the same four hours, so your standup is never at midnight. US teams: we shift the day and agree the overlap in the SOW."), ("Can we hire them permanently later?", "Yes. After six months there is no fee; before that, one month of the day rate. We would rather you had the person than a clause.")],
         close="Tell us who is missing. We will show you who we would send."),
    dict(title="Pipelines and reporting<br>people stop arguing with.",
         gets=["Ingest and warehouse work the in-house team can run after we leave", "One source of truth: a warehouse and a semantic layer, documented where your team looks", "Dashboards the people who asked for them actually open", "A before-and-after measurement on every increment"],
         no=["You want a dashboard before anyone agrees what the numbers mean", "The data does not exist yet and nobody owns collecting it"],
         steps=[("Week 0", "Read the pipeline", "Sources, schedules, the queries people run by hand, and the two numbers that disagree."), ("Week 1", "The baseline", "How long the nightly run takes, how often it fails, and which report nobody trusts. Written down."), ("Week 3", "First increment", "The worst pipeline replaced: incremental, idempotent, with a dead-letter queue and a replay."), ("Week 6", "Runs without us", "Runbook, alerts and the on-call steps in your wiki; your team runs it for a week while we watch."), ("Fortnightly", "The review", "The same numbers as week one, after. Then the next pipeline, or the handover.")],
         record=[("C", 1), ("F", 16), ("C", 9), ("F", 17)],
         faq=[("Which warehouse?", "The one you have, unless it is the problem. We have shipped on PostgreSQL, Redshift, TimescaleDB and Athena over S3; we will say on the call if yours is the wrong tool."), ("Do you do the dashboards too?", "Yes, and we start from the question the dashboard answers, not the chart. If nobody can say what decision it changes, we build the pipeline first and the dashboard last."), ("What does measured mean here?", "A number from before, the same number from after, and the unit: run time, failure rate, freshness, the gap between two reports. It goes in the review you sign.")],
         close="Bring the report nobody trusts. We will tell you why."),
    dict(title="Features that have to be<br>right, not impressive.",
         gets=["An evaluation harness before a demo: a number you can defend to your board", "Retrieval done properly: chunking, ranking, citations, and the cases where it should say nothing", "Cost and latency budgeted up front, then measured in production", "Monitoring, retraining and rollout owned end to end, not handed to you as a notebook"],
         no=["The goal is an AI feature rather than a problem the feature solves", "There is no data you are allowed to use, and no plan to get some"],
         steps=[("Week 0", "The problem, in a sentence", "What the model must get right, how often, and what happens when it is wrong."), ("Week 1", "Eval set and baseline", "A few hundred real cases, labelled with you. The number today, before any model."), ("Week 3", "First model behind a gate", "Retrieval or classification in a staging environment, released only when the number moves."), ("Week 6", "In production, watched", "Monitoring on quality, cost and latency; a retraining loop; a person in the loop where it matters."), ("Fortnightly", "The review", "The eval number, the bill and the latency, before and after. Then the next feature.")],
         record=[("F", 3), ("F", 11), ("F", 12), ("F", 5), ("C", 6), ("F", 18)],
         faq=[("Which models do you use?", "Whichever passes the eval at a cost you can afford. We have shipped on Claude, OpenAI, Gemini and Bedrock, and on small models where a large one was too expensive. The harness decides, not the logo."), ("Will it hallucinate?", "Sometimes, which is why the harness exists. Retrieval with citations, refusal when the sources are thin, and a measured false-answer rate you can see every fortnight."), ("Can you use our data without it leaving our account?", "Yes. Models run in your cloud account or through a provider with no training on your data, and the retrieval index lives with you.")],
         close="Tell us what it must get right. We will say how to measure it."),
    dict(title="Deploys that<br>are boring.",
         gets=["CI/CD with tests before features, not after the first incident", "Infrastructure as code, reviewed like code, with a plan you can read before it applies", "Observability you can act on, and a runbook for the thing that pages you", "A cloud bill you can explain, line by line, and a smaller one"],
         no=["You want us to hold the pager forever instead of handing it back", "Kubernetes is the goal rather than a decision"],
         steps=[("Week 0", "Read the estate", "Accounts, pipelines, what deploys by hand, what nobody dares touch, and last month's bill."), ("Week 1", "Pipeline and IaC baseline", "Every service deployable from a pull request; the infrastructure in code, even if it is ugly code."), ("Week 3", "Observability and runbooks", "Logs, metrics and traces where they are useful; an on-call runbook for each alert that can fire."), ("Week 6", "Your team owns it", "Deploy frequency, lead time and the bill, before and after. Your engineers ran the last week."), ("Fortnightly", "The review", "What broke, what did not, what it cost. Then the next piece, or the handover.")],
         record=[("F", 7), ("F", 14), ("F", 6)],
         faq=[("AWS, Azure or GCP?", "Mostly AWS, some Azure. If you are on GCP we will say so on the call rather than learn it on your time."), ("Do we need Kubernetes?", "Usually not. We have run production on EKS where it earned its keep and on Lambda, Railway and plain containers where it did not. The decision is written down with the reasons."), ("Who is on call?", "Your team, with our runbook, from week six. Until then we are, and the handover includes a week of us watching them run it.")],
         close="Show us the deploy you dread. We will make it boring."),
    dict(title="Rebuilds the in-house<br>team can run.",
         gets=["Strangler-pattern migration: one bounded piece at a time, never a big-bang cutover", "Old and new running side by side until the numbers match", "Parity measured: same inputs, same outputs, in your environment, before anything is switched off", "Knowledge captured where your team looks, not in our heads"],
         no=["Rewrite it all is the plan, and the only plan", "Nobody can say what the system does today, and nobody wants to find out"],
         steps=[("Week 0", "Map the seams", "What the system does, who depends on it, and where it can be cut without anyone noticing."), ("Week 1", "First seam, parity test", "The smallest valuable piece chosen; a test that replays real inputs through old and new."), ("Week 6", "First seam cut over", "New code taking real traffic for one bounded piece; the old path still there, one flag away."), ("Then", "One seam per increment", "The same loop, piece by piece, each one measured, each one reversible."), ("Fortnightly", "The review", "What moved, what matched, what the old system still owns. Then the next seam.")],
         record=[("F", 7), ("F", 15), ("F", 14)],
         faq=[("How long does a migration take?", "Longer than a rewrite is promised to take and shorter than a rewrite actually takes. The first seam is live in six weeks; after that you can see the rate and decide the pace."), ("What if the old system has no tests?", "Then the parity test is the first thing we write: real inputs recorded, replayed through both paths, differences listed. It is the only safe way to learn what the system does."), ("Can we stop halfway?", "Yes, and the system is better than when we started: the pieces already moved keep running, and the map of the rest is yours.")],
         close="Name the system nobody touches. We will say where to cut first."),
    dict(title="iOS and Android<br>without two teams.",
         gets=["One codebase where the product allows; native where it does not, and the decision written down", "Store-ready from the start: signing, review guidelines, a release pipeline before the first submission", "Crash reporting and analytics from day one, not after the first one-star review", "Offline-first where the device will actually be offline"],
         no=["The app is a website in a wrapper and should stay a website", "Two native teams are wanted for reasons that are not about the product"],
         steps=[("Week 0", "The platform decision", "What the app must do on a bad network, what it needs from the device, and who installs it."), ("Week 1", "The release pipeline", "Signing, TestFlight and Play tracks, crash reporting, analytics. Before the first screen."), ("Week 6", "First build in testers' hands", "A real journey end to end, on real devices, measured."), ("Then", "Store submission", "Review guidelines handled before review, not after rejection."), ("Fortnightly", "The review", "Crash-free rate, adoption, the next journey. Your call.")],
         record=[("F", 6), ("C", 3), ("F", 4), ("F", 5)],
         faq=[("Native or cross-platform?", "Depends on the product, not on us. We have shipped Kotlin, custom Android (AOSP) players, and cross-platform builds; the decision goes in the SOW with the reasons."), ("Do you handle the app stores?", "Yes: accounts, signing, review guidelines, the release notes. If Apple rejects a build, that is our problem on our time."), ("What about devices that are offline for days?", "Offline-first sync is something we have built for signage players that lose their connection for a week; the app keeps working and reconciles when it can.")],
         close="Tell us what the app must do offline. We will say how."),
    dict(title="Suites that make<br>deploys boring.",
         gets=["Unit, integration and end-to-end coverage that runs in CI in minutes", "Flaky tests tracked and fixed, not retried until green", "Load testing before the launch, not after the outage", "The same discipline for AI features: an evaluation harness that gates release"],
         no=["Coverage is wanted as a number rather than as fewer incidents", "Tests are wanted so that nobody has to review"],
         steps=[("Week 0", "Read the suite", "What exists, what is skipped, what is flaky, and how long a green build takes today."), ("Week 1", "A gate on every pull request", "The suite runs in CI in minutes; a red build blocks the merge, and everyone can see why."), ("Week 3", "End to end on the journeys that matter", "The five flows that would make the phone ring, covered on real browsers and devices."), ("Week 6", "Load test and handover", "The launch load, run before the launch; your team owns the suite and the flake board."), ("Fortnightly", "The review", "Build time, flake rate, incidents, before and after. Then the next gap.")],
         record=[("F", 5), ("F", 12), ("F", 3)],
         faq=[("What tools?", "Playwright, pytest, Jest and k6 for most stacks, plus generated tests and guardrails from our agentic pipeline where the codebase suits it. The tool follows the stack; we do not make you adopt ours."), ("Will tests slow the team down?", "A suite that runs in minutes speeds the team up; one that takes an hour gets skipped. The first thing we measure is build time, and it goes down before coverage goes up."), ("Can you test the AI features too?", "Yes. Evaluation harnesses are tests: a labelled set, a number, a gate in CI. We have shipped them for computer vision, recommendation and retrieval features.")],
         close="Show us the suite everyone skips. We will make it trusted."),
]

def service_page(i):
    name, tag, desc, gets3, chips, shape, href = SERVICES[i]
    d = SVC[i]; fn = SVC_FILES[i]
    TONE["t"] = "d"
    hero_h = page_hero("Service " + str(i + 1).zfill(2) + " &#183; " + name, d["title"], desc, [("Book a consult", BOOK), ("See our work", WORK)])
    hero_h = hero_h.replace('<div class="chips"><a class="chip2" href="' + BOOK + '">Book a consult</a><a class="chip2" href="' + WORK + '">See our work</a></div>',
                            '<div style="display: flex; align-items: center; gap: 14px; margin-top: 6px;">' + btn("Book a consult", "lime", BOOK) + btn("See our work", "outline", WORK) + '</div>' +
                            _facts_row([(a, b) for a, b in gets3] + [("Priced", shape)]).replace('font-size: 26px;', 'font-size: 22px;'))
    # ---- light: what you get / good for / no / stack / record
    TONE["t"] = "l"
    light = ('<div class="wrap" style="padding: 100px 0 0;"><section style="display: grid; grid-template-columns: 1.1fr 1fr; gap: 72px; align-items: start;"><div class="rv" style="display: flex; flex-direction: column; gap: 22px;">' + h2("What you get.", 44) +
             '<div class="list">' + ''.join('<div><i></i><span>' + g + '</span></div>' for g in d["gets"]) + '</div>'
             '<div style="font-family: ' + MONO + '; font-size: 12px; line-height: 1.7; color: ' + DIM + ';">Priced: <span style="color: ' + SUB + ';">' + shape + ' &#183; from [YOUR RATE] / day</span> &#183; <a href="SITE_Rates.dc.html" class="more" style="color: ' + LIME + '; text-decoration: none; font-family: ' + MONO + '; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase;">See rates &#8594;</a></div></div>'
             '<div class="rv" style="transition-delay: 90ms; display: flex; flex-direction: column; gap: 36px;"><div>' + lab("Good for") + '<div style="margin-top: 12px; display: flex; flex-direction: column; gap: 8px; font-size: 17px; line-height: 1.5;">' + ''.join('<div>&#8212; ' + g + '</div>' for g in GOOD[i]) + '</div></div>'
             '<div>' + lab("We will say no when", LIME) + '<div style="margin-top: 12px; display: flex; flex-direction: column; gap: 8px; font-size: 17px; line-height: 1.5; color: ' + SUB + ';">' + ''.join('<div>&#8212; ' + g + '</div>' for g in d["no"]) + '</div></div>'
             '<div>' + lab("Stack &#183; only what we have shipped to production") + '<div style="margin-top: 12px; display: flex; flex-wrap: wrap; gap: 6px;">' + ''.join('<span style="font-family: ' + MONO + '; font-size: 11px; letter-spacing: 0.06em; color: ' + SUB + '; border: 1px solid ' + LINE + '; border-radius: 6px; padding: 6px 9px;">' + c + '</span>' for c in chips) + '</div></div></div></section>')
    cases = [(RECORD if k == "F" else CASES)[j] for k, j in d["record"]]
    light += ('<section style="padding: 110px 0 120px;"><style>.phx{color:var(--acc);font-family:' + MONO + ';font-size:12px}</style><div class="rv" style="display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 28px;">' + h2("From the record.", 44) + '<a href="' + WORK + '" class="more" style="text-decoration: none; font-family: ' + MONO + '; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: ' + LIME + ';">All case notes &#8594;</a></div>'
              '<div style="display: grid; grid-template-columns: repeat(' + ('2' if len(cases) < 4 else '2') + ', minmax(0, 1fr)); gap: 24px;">' + ''.join(case_card(j, *c) for j, c in enumerate(cases[:4])) + '</div></section></div>')
    # ---- dark: how it runs + faq + the other seven
    TONE["t"] = "d"
    dark = ('<div class="wrap"><section style="padding: 100px 0 0;"><div class="rv" style="display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 36px;">' + h2("How it runs.", 44) + lab("The same loop as every engagement") + '</div><div class="steps rv">' +
            ''.join('<div class="' + ('on' if j == 1 else '') + '">' + lab(a, LIME if j == 1 else DIM) + '<div style="font-size: 18px; font-weight: 600; letter-spacing: -0.02em;">' + b + '</div><div style="font-size: 14px; line-height: 22px; color: ' + DIM + ';">' + c + '</div></div>' for j, (a, b, c) in enumerate(d["steps"])) + '</div></section>'
            '<section class="faq" style="padding: 100px 0 0;"><div class="rv">' + h2("Questions we get about this.", 44) + '</div><div style="margin-top: 32px; max-width: 800px;">' + ''.join('<div class="item rv"><div class="t"><span>' + q + '</span><span class="pl">+</span></div><div class="b">' + a + '</div></div>' for q, a in d["faq"]) + '<div style="border-top: 1px solid ' + LINE + ';"></div></div></section>'
            '<section style="padding: 100px 0 120px;"><div class="rv" style="display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 20px;">' + h2("The other seven.", 32) + lab("All eight end in something running") + '</div><div class="rv" style="display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 0 24px; border-top: 1px solid ' + LINE + ';">' +
            ''.join('<' + ('span' if j == i else 'a href="' + SVC_FILES[j] + '"') + ' style="text-decoration: none; display: grid; grid-template-columns: 34px 1fr auto; gap: 12px; align-items: baseline; padding: 16px 0; border-bottom: 1px solid ' + LINE + '; color: ' + (DIM if j == i else TEXT) + ';"><span style="font-family: ' + MONO + '; font-size: 11px; letter-spacing: 0.12em; color: ' + (DIM if j == i else LIME) + ';">' + str(j + 1).zfill(2) + '</span><span style="font-size: 16px; font-weight: 600; letter-spacing: -0.02em;">' + SERVICES[j][0] + '</span><span style="font-family: ' + MONO + '; font-size: 12px; color: ' + DIM + ';">' + ('here' if j == i else '&#8594;') + '</span></' + ('span' if j == i else 'a') + '>' for j in range(8)) + '</div></section></div>')
    TONE["t"] = "l"; close_h = closing(name + " &#183; the call", d["close"])
    html = wrap(surface("d", hero_h, seam=False) + surface("l", light) + surface("d", dark) + surface("l", close_h), "Services")
    return html.replace('<title>Hopsig — Services</title>', '<title>Hopsig — ' + name.replace('&amp;', '&') + '</title>')

def services_index():
    rows = ''.join('<a href="' + SVC_FILES[j] + '" style="text-decoration: none; display: grid; grid-template-columns: 40px 1fr auto auto; gap: 16px; align-items: baseline; padding: 18px 0; border-bottom: 1px solid ' + LINE + '; color: ' + TEXT + ';"><span style="font-family: ' + MONO + '; font-size: 11px; letter-spacing: 0.12em; color: ' + LIME + ';">' + str(j + 1).zfill(2) + '</span><span style="font-size: 19px; font-weight: 600; letter-spacing: -0.02em;">' + SERVICES[j][0] + '</span><span style="font-family: ' + MONO + '; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: ' + DIM + ';">' + SERVICES[j][5] + '</span><span style="font-family: ' + MONO + '; font-size: 12px; color: ' + LIME + ';">&#8594;</span></a>' for j in range(8))
    return ('<section style="padding: 0 0 100px;"><div class="rv" style="display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 24px;">' + h2("Eight things we do, in detail.", 44) + lab("One page each") + '</div><div class="rv" style="display: grid; grid-template-columns: 1fr 1fr; gap: 0 48px; border-top: 1px solid ' + LINE + ';">' + rows + '</div></section>')

# ------------------------------------------------------------------ INDUSTRY PAGES (index + one per industry)
IND_FILES = ["SITE_I1_Fintech.dc.html", "SITE_I2_Retail.dc.html", "SITE_I3_Health.dc.html", "SITE_I4_Logistics.dc.html", "SITE_I5_IoT.dc.html", "SITE_I6_SaaS.dc.html"]
IND = [
    dict(name="Fintech &amp; payments", short="Fintech", title="Payments that clear.<br>Books that balance.",
         sub="Embedded payments, wallets, KYC and the reporting finance teams trust: built under PCI-DSS, measured by conversion and settlement rather than by features.",
         facts=[("150+", "merchants, four months after launch"), ("100K+", "transactions in the same four months"), ("PCI-DSS", "compliance built in from day one"), ("KYC", "document verification, automated")],
         record=[("F", 0), ("C", 5), ("F", 1)], lead=2,
         asks=[("PCI-DSS and KYC", "Scope the cardholder-data boundary first and keep it small. Automate the document checks so onboarding never waits on a review queue."), ("Fraud and reconciliation", "Anomaly detection across payments and balances, and a ledger that reconciles to the processor every day rather than at month end."), ("Conversion as the metric", "Checkout and onboarding conversion measured from week one. Payment-method mix decides what gets built next.")],
         services=[(0, "The platform itself: onboarding, wallets, billing, in your cloud account."), (3, "Fraud and anomaly detection with an evaluation gate, not a rule that nobody dares change."), (2, "Reconciliation and finance reporting that matches the processor."), (7, "Load tested before the campaign, not during it.")],
         close="Tell us what has to clear. We will say how we would build it."),
    dict(name="Retail &amp; e-commerce", short="Retail", title="Checkouts that convert.<br>Stock that is where it says.",
         sub="Storefronts, loyalty, personalisation, inventory and POS: for retailers from one store to a hundred, measured by repeat purchase and conversion.",
         facts=[("5&#215;", "repeat transactions, enterprise loyalty"), ("261&#215;", "client ROI from personalisation, upper bound"), ("100+", "cloud POS locations"), ("75%", "more repeat customers in two months")],
         record=[("F", 1), ("F", 3), ("F", 4), ("F", 2), ("C", 4), ("C", 9), ("C", 10), ("F", 15)], lead=2,
         asks=[("Peak load", "Loyalty and checkout on microservices with caching for the Friday night that matters, load-tested before the campaign."), ("Inventory truth", "One stock position across stores, warehouses and the app, with the reconciliation jobs that keep it true."), ("Repeat purchase", "Loyalty rules with fraud risk designed in, personalisation with evaluation gates, and a funnel instrumented so every change is proven rather than asserted.")],
         services=[(0, "Storefront, loyalty engine, POS: built to a scope, in your cloud."), (2, "Funnel instrumentation and the warehouse behind the dashboards."), (3, "Recommendation and image search with evaluation before release."), (6, "The quick-commerce app, store-ready, with offline tolerance.")],
         close="Bring the funnel. We will say where it leaks."),
    dict(name="Healthcare &amp; life sciences", short="Healthcare", title="Software a regulator<br>will sign off.",
         sub="Insurance platforms, telemedicine, surgical imaging, preclinical research data and care-home IoT: built to be supervised, audited and still used.",
         facts=[("60%", "less analysis time on preclinical data"), ("HIPAA-grade", "handling of patient data and imaging"), ("Supervised", "insurance platform launched under regulation"), ("Validated", "IoT alerting proven in real care settings before scaling")],
         record=[("F", 8), ("C", 0), ("F", 9), ("F", 10), ("C", 1)], lead=2,
         asks=[("Regulatory sign-off", "Map the underwriting, claims or clinical workflow before designing against it. Keep a document a supervisor can read beside the product a member can use."), ("Patient data", "Role-based access, HIPAA-grade handling, imaging on object storage with audit trails. Nothing leaves the account it lives in."), ("Trust in the alert", "Validate in real care settings before scaling. A model's output has to earn a clinician's trust, so precision is measured before rollout.")],
         services=[(0, "The member, patient or clinician journey, from discovery to launch."), (3, "Imaging analysis and alerting with the evaluation to defend it."), (2, "Harmonised research data and the dashboards over it."), (7, "Test coverage a regulator can read.")],
         close="Tell us who has to sign it off. We will design for them."),
    dict(name="Logistics, travel &amp; marketplaces", short="Logistics", title="Real-time, on the road,<br>on a bad connection.",
         sub="Dispatch boards, driver apps, vehicle marketplaces and travel products: three kinds of user sharing one system, and the data that keeps them honest.",
         facts=[("Real-time", "load status and assignments over WebSockets"), ("3 roles", "transporter, driver and customer in one app"), ("500%", "growth in qualified inbound leads, six months, audited"), ("3 modules", "rental, flights and community in one product")],
         record=[("C", 2), ("C", 3), ("C", 11), ("C", 8)], lead=2,
         asks=[("Live state", "WebSockets for status and assignment, live tracking on the map, and revenue and broker analytics from the same stream."), ("Drivers in motion", "Large targets, quick actions, offline tolerance. The interface is designed for a hand on the wheel, not a desk."), ("Demand", "Intent-based landing pages and listing schema so the marketplace fills without buying every lead.")],
         services=[(0, "The dispatch board and the admin behind it."), (6, "The driver and customer app, offline-tolerant, store-ready."), (2, "Route, revenue and broker analytics from live data."), (4, "The infrastructure that keeps real-time real at peak.")],
         close="Tell us what moves. We will keep the screen honest about where it is."),
    dict(name="IoT, signage &amp; the built environment", short="IoT &amp; signage", title="Devices that keep working<br>when the network does not.",
         sub="Digital signage platforms, device telemetry and building intelligence: offline-first players, fleet sync, public APIs and dashboards for the people who run the estate.",
         facts=[("200+", "buildings on one telemetry platform"), ("4 continents", "signage platform in production"), ("Offline-first", "device sync over MQTT"), ("Public APIs", "device telemetry open to partners")],
         record=[("F", 6), ("F", 7), ("F", 17), ("F", 13), ("F", 10)], lead=2,
         asks=[("Offline-first", "Players and sensors that lose the network for a week keep working and reconcile when they return. Sync over MQTT, not polling."), ("Fleet at scale", "Multi-tenant backends, partner integrations with the display makers, and infrastructure that stays up under sustained memory pressure."), ("Telemetry people act on", "Real-time operational data rather than last month's report, and APIs partners can build on, with versioning and documentation.")],
         services=[(0, "The platform: tenants, CMS, players, partner integrations."), (4, "The fleet's infrastructure, stabilised and observable."), (6, "Custom Android players and the apps that control them."), (2, "Telemetry pipelines and the dashboards the estate team opens.")],
         close="Tell us what the devices must do when the network is down."),
    dict(name="SaaS, platforms &amp; AI products", short="SaaS &amp; AI", title="Products that ship<br>and keep shipping.",
         sub="Multi-tenant SaaS, enterprise platforms, developer APIs and AI products: built with an agentic pipeline and the evaluation discipline to keep them right.",
         facts=[("10", "engineers on the agentic delivery path"), ("98%", "detection accuracy, computer-vision product"), ("Multi-tenant", "SaaS with a white-label reseller tier"), ("On the date", "critical milestone shipped on deadline")],
         record=[("F", 5), ("F", 12), ("F", 14), ("F", 19), ("C", 6), ("F", 18), ("F", 16)], lead=2,
         asks=[("Multi-tenancy", "Tenants, white-label tiers and credit-based monetisation designed in from the schema up, not bolted on when the second customer arrives."), ("Integrations", "Dynamics, Dataverse, SharePoint, Power BI, Xero: the plumbing is most of the product, so it is reviewed like the product."), ("AI that stays right", "Evaluation gates before release, monitoring after, small models where a large one is too expensive. The harness decides.")],
         services=[(0, "The product, scoped and shipped in six-week increments."), (3, "Model features, agents and retrieval with a number to defend."), (1, "Senior engineers inside your team when the roadmap outgrows it."), (7, "Generated tests and guardrails on every change.")],
         close="Tell us what the product must do next quarter. We will say how we would ship it."),
]

def _facts_row(facts):
    return ('<div style="display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 24px; margin-top: 30px; padding-top: 18px; border-top: 1px solid ' + LINE + '; max-width: 900px;">' +
            ''.join('<div><div style="font-size: 26px; font-weight: 600; letter-spacing: -0.035em; line-height: 1; color: ' + TEXT + ';">' + a + '</div><div style="font-size: 13px; line-height: 20px; color: ' + DIM + '; margin-top: 8px;">' + b + '</div></div>' for a, b in facts) + '</div>')

def _case_row(n, c):
    dom, title, prob, did, meas, stack, shape = c
    return ('<div class="rv" style="display: grid; grid-template-columns: 52px 1.1fr 1.6fr auto; gap: 20px; align-items: baseline; padding: 16px 0; border-bottom: 1px solid ' + LINE + ';"><span style="font-family: ' + MONO + '; font-size: 11px; letter-spacing: 0.12em; color: ' + LIME + ';">' + str(n).zfill(2) + '</span>'
            '<div><div style="font-size: 17px; font-weight: 600; letter-spacing: -0.02em;">' + title + '</div><div style="font-family: ' + MONO + '; font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: ' + DIM + '; margin-top: 4px;">' + dom + '</div></div>'
            '<div style="font-size: 14px; line-height: 22px; color: ' + SUB + ';">' + meas + '</div>'
            '<span style="font-family: ' + MONO + '; font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: ' + DIM + '; white-space: nowrap;">' + shape + '</span></div>')

def industry_page(i):
    d = IND[i]
    TONE["t"] = "d"
    hero_h = page_hero("Industry &#183; " + d["name"], d["title"], d["sub"], [("Book a consult", BOOK), ("See our work", WORK)])
    hero_h = hero_h.replace('<div class="chips"><a class="chip2" href="' + BOOK + '">Book a consult</a><a class="chip2" href="' + WORK + '">See our work</a></div>',
                            '<div style="display: flex; align-items: center; gap: 14px; margin-top: 6px;">' + btn("Book a consult", "lime", BOOK) + btn("See our work", "outline", WORK) + '</div>' + _facts_row(d["facts"]))
    cases = [(RECORD if k == "F" else CASES)[j] for k, j in d["record"]]
    lead, rest = cases[:d["lead"]], cases[d["lead"]:]
    TONE["t"] = "l"
    light = ('<div class="wrap" style="padding: 100px 0 120px;"><style>.phx{color:var(--acc);font-family:' + MONO + ';font-size:12px}</style><div class="rv" style="display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 28px;">' + h2("What we have shipped here.", 44) + lab(str(len(cases)) + " case notes &#183; client names withheld") + '</div>'
             '<div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 24px;">' + ''.join(case_card(j, *c) for j, c in enumerate(lead)) + '</div>'
             + (('<div style="border-top: 1px solid ' + LINE + '; margin-top: 40px;">' + ''.join(_case_row(len(lead) + j + 1, c) for j, c in enumerate(rest)) + '</div>') if rest else '') +
             '<div class="rv" style="margin-top: 22px; display: flex; justify-content: flex-end;"><a href="' + WORK + '" class="more" style="text-decoration: none; font-family: ' + MONO + '; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: ' + LIME + ';">All ' + str(len(RECORD) + len(CASES)) + ' case notes &#8594;</a></div>'
             '<section style="padding-top: 100px; display: grid; grid-template-columns: 1fr 1.3fr; gap: 72px; align-items: start;"><div class="rv" style="display: flex; flex-direction: column; gap: 16px; position: sticky; top: 100px;">' + lab("What this industry asks for", LIME) + h2("The three questions we get before the first call ends.", 40) + '</div>'
             '<div class="rv" style="transition-delay: 90ms; border-top: 1px solid ' + LINE + ';">' + ''.join('<div style="display: grid; grid-template-columns: 44px 200px 1fr; gap: 20px; align-items: baseline; padding: 22px 0; border-bottom: 1px solid ' + LINE + ';"><span style="font-family: ' + MONO + '; font-size: 11px; letter-spacing: 0.12em; color: ' + LIME + ';">' + str(j + 1).zfill(2) + '</span><span style="font-size: 20px; font-weight: 600; letter-spacing: -0.025em;">' + a + '</span><span style="font-size: 15px; line-height: 24px; color: ' + SUB + ';">' + b + '</span></div>' for j, (a, b) in enumerate(d["asks"])) + '</div></section></div>')
    TONE["t"] = "d"
    dark = ('<div class="wrap"><section style="padding: 100px 0 0;"><div class="rv" style="display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 24px;">' + h2("Services that fit.", 44) + '<a href="SITE_Services.dc.html" class="more" style="text-decoration: none; font-family: ' + MONO + '; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: ' + LIME + ';">All eight &#8594;</a></div>'
            '<div class="rv" style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 20px;">' + ''.join('<a href="' + SVC_FILES[k] + '" style="text-decoration: none; color: ' + TEXT + '; border: 1px solid ' + LINE + '; background: ' + PANEL + '; border-radius: 12px; padding: 24px 26px; display: grid; grid-template-columns: 40px 1fr auto; gap: 16px; align-items: baseline;"><span style="font-family: ' + MONO + '; font-size: 11px; letter-spacing: 0.12em; color: ' + LIME + ';">' + str(k + 1).zfill(2) + '</span><span><span style="display: block; font-size: 20px; font-weight: 600; letter-spacing: -0.025em;">' + SERVICES[k][0] + '</span><span style="display: block; margin-top: 6px; font-size: 14px; line-height: 22px; color: ' + DIM + ';">' + why + '</span></span><span style="font-family: ' + MONO + '; font-size: 12px; color: ' + LIME + ';">&#8594;</span></a>' for k, why in d["services"]) + '</div></section>'
            '<section style="padding: 100px 0 120px;"><div class="rv" style="display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 20px;">' + h2("The other industries.", 32) + '<a href="SITE_Industries.dc.html" class="more" style="text-decoration: none; font-family: ' + MONO + '; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: ' + LIME + ';">All six &#8594;</a></div><div class="rv" style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 0 24px; border-top: 1px solid ' + LINE + ';">' +
            ''.join('<' + ('span' if j == i else 'a href="' + IND_FILES[j] + '"') + ' style="text-decoration: none; display: grid; grid-template-columns: 34px 1fr auto; gap: 12px; align-items: baseline; padding: 16px 0; border-bottom: 1px solid ' + LINE + '; color: ' + (DIM if j == i else TEXT) + ';"><span style="font-family: ' + MONO + '; font-size: 11px; letter-spacing: 0.12em; color: ' + (DIM if j == i else LIME) + ';">' + str(j + 1).zfill(2) + '</span><span style="font-size: 16px; font-weight: 600; letter-spacing: -0.02em;">' + IND[j]["name"] + '</span><span style="font-family: ' + MONO + '; font-size: 12px; color: ' + DIM + ';">' + ('here' if j == i else '&#8594;') + '</span></' + ('span' if j == i else 'a') + '>' for j in range(6)) + '</div></section></div>')
    TONE["t"] = "l"; close_h = closing(d["short"] + " &#183; the call", d["close"])
    html = wrap(surface("d", hero_h, seam=False) + surface("l", light) + surface("d", dark) + surface("l", close_h), "Industries")
    return html.replace('<title>Hopsig — Industries</title>', '<title>Hopsig — ' + d["name"].replace('&amp;', '&') + '</title>')

def industries():
    TONE["t"] = "d"
    hero_h = page_hero("Industries", "Six industries.<br>Thirty-two case notes.", "Client names are withheld; the numbers are not. Pick the industry closest to yours and read what we shipped there, what it measured, and which of the eight services it took.", [("Book a consult", BOOK), ("See our work", WORK)])
    hero_h = hero_h.replace('<div class="chips"><a class="chip2" href="' + BOOK + '">Book a consult</a><a class="chip2" href="' + WORK + '">See our work</a></div>', '<div style="display: flex; align-items: center; gap: 14px; margin-top: 6px;">' + btn("Book a consult", "lime", BOOK) + btn("See our work", "outline", WORK) + '</div>')
    TONE["t"] = "l"
    rows = ''
    for i, d in enumerate(IND):
        n = len(d["record"]); f = d["facts"][0]
        rows += ('<a href="' + IND_FILES[i] + '" class="irow rv" style="transition-delay: ' + str(i * 60) + 'ms;"><span class="n">' + str(i + 1).zfill(2) + '</span><span><span class="t">' + d["name"] + '</span><span class="s">' + d["sub"].split(':')[0] + '</span></span><span class="m"><b>' + f[0] + '</b>' + f[1] + '</span><span class="c">' + str(n) + ' notes</span><span class="r">&#8594;</span></a>')
    light = ('<div class="wrap" style="padding: 100px 0 120px;"><div class="rv" style="display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 28px;">' + h2("Where we have done this before.", 44) + lab("Hover for the headline number") + '</div><div class="ilist">' + rows + '</div></div>')
    TONE["t"] = "l"; close_h = closing("Industries &#183; the call", "If yours is not on the list, the call is still thirty minutes.")
    return wrap(surface("d", hero_h, seam=False) + surface("l", light + close_h), "Industries")

# ------------------------------------------------------------------ MORE PAGES
def _hero_btns(hero_h, extra=''):
    return hero_h.replace('<div class="chips"><a class="chip2" href="' + BOOK + '">Book a consult</a><a class="chip2" href="' + WORK + '">See our work</a></div>',
                          '<div style="display: flex; align-items: center; gap: 14px; margin-top: 6px;">' + btn("Book a consult", "lime", BOOK) + btn("See our work", "outline", WORK) + '</div>' + extra)

def _steps(steps, on=1):
    return '<div class="steps rv">' + ''.join('<div class="' + ('on' if j == on else '') + '">' + lab(a, LIME if j == on else DIM) + '<div style="font-size: 18px; font-weight: 600; letter-spacing: -0.02em;">' + b + '</div><div style="font-size: 14px; line-height: 22px; color: ' + DIM + ';">' + c + '</div></div>' for j, (a, b, c) in enumerate(steps)) + '</div>'

def _faq(items, title="Questions we get about this."):
    return ('<section class="faq" style="padding: 100px 0 0;"><div class="rv">' + h2(title, 44) + '</div><div style="margin-top: 32px; max-width: 800px;">' + ''.join('<div class="item rv"><div class="t"><span>' + q + '</span><span class="pl">+</span></div><div class="b">' + a + '</div></div>' for q, a in items) + '<div style="border-top: 1px solid ' + LINE + ';"></div></div></section>')

def _ledger(items, cols="44px 260px 1fr"):
    return ('<div class="rv" style="border-top: 1px solid ' + LINE + ';">' + ''.join('<div style="display: grid; grid-template-columns: ' + cols + '; gap: 20px; align-items: baseline; padding: 22px 0; border-bottom: 1px solid ' + LINE + ';"><span style="font-family: ' + MONO + '; font-size: 11px; letter-spacing: 0.12em; color: ' + LIME + ';">' + str(j + 1).zfill(2) + '</span><span style="font-size: 20px; font-weight: 600; letter-spacing: -0.025em;">' + a + '</span><span style="font-size: 15px; line-height: 24px; color: ' + SUB + ';">' + b + '</span></div>' for j, (a, b) in enumerate(items)) + '</div>')

def _two_col(title, sub_html, right_html, eyebrow=None):
    return ('<section style="padding-top: 100px; display: grid; grid-template-columns: 1fr 1.3fr; gap: 72px; align-items: start;"><div class="rv" style="display: flex; flex-direction: column; gap: 16px; position: sticky; top: 100px;">' + (lab(eyebrow, LIME) if eyebrow else '') + h2(title, 40) + (('<p style="margin: 0; font-size: 16px; line-height: 27px; color: ' + SUB + ';">' + sub_html + '</p>') if sub_html else '') + '</div><div class="rv" style="transition-delay: 90ms;">' + right_html + '</div></section>')

# ---- Notes index
def notes_index():
    TONE["t"] = "d"
    hero_h = _hero_btns(page_hero("Notes", "Things we would say<br>on the call anyway.", "Short and opinionated, written by the people doing the work. No newsletter, no pop-up, no reading time invented.", [("Book a consult", BOOK), ("See our work", WORK)]))
    TONE["t"] = "l"
    cats = sorted(set(p["cat"] for p in POSTS))
    rows = ''.join(('<a href="' + p["page"] + '" class="irow rv"' if "page" in p else '<div class="irow rv" style="opacity: .55; pointer-events: none;"') + ' style="transition-delay: ' + str(i * 60) + 'ms;"><span class="n">' + str(i + 1).zfill(2) + '</span><span><span class="t">' + p["title"] + '</span><span class="s">' + p["excerpt"] + '</span></span><span class="m">' + p["cat"] + '</span><span class="c">' + ("Read" if "page" in p else "[DRAFT]") + '</span><span class="r">' + ("&#8594;" if "page" in p else "&#8230;") + '</span>' + ('</a>' if "page" in p else '</div>') for i, p in enumerate(POSTS))
    light = ('<div class="wrap" style="padding: 100px 0 120px;"><div class="rv" style="display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 28px; gap: 40px;">' + h2("All notes.", 44) + '<div style="display: flex; gap: 8px; flex-wrap: wrap;">' + ''.join('<span style="font-family: ' + MONO + '; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: ' + DIM + '; border: 1px solid ' + LINE + '; border-radius: 8px; padding: 9px 12px;">' + c + '</span>' for c in cats) + '</div></div><div class="ilist">' + rows + '</div>'
             '<div class="rv" style="margin-top: 26px; font-family: ' + MONO + '; font-size: 11px; line-height: 1.7; color: ' + DIM + ';">Build note: this list renders from <span style="color: ' + SUB + ';">*[_type == "post" &amp;&amp; defined(publishedAt)] | order(publishedAt desc)</span>; two notes have pages in this prototype, the rest are titles until written.</div></div>')
    close_h = closing("Notes &#183; the call", "Disagree with one? Thirty minutes, and bring the counter-argument.")
    return wrap(surface("d", hero_h, seam=False) + surface("l", light + close_h), "Notes")

# ---- One full note
NOTE_AGENTS = [
    ('p', "Every few months a word arrives that everyone has to have an opinion about. This month it is superintelligence: the labs are reorganising around it, governments are renaming things after it, and a two-letter country-code domain has become a speculative asset because its letters happen to match. None of that changes what your team ships on Friday."),
    ('p', "We work with heads of engineering at companies of twenty to two hundred people. The question they ask is never what our position on superintelligence is. It is: my team of eight is behind, the roadmap is not getting shorter, and I have budget for two people. What do I do?"),
    ('h2', "What changed, concretely"),
    ('p', "Agents can now take a story, implement it inside guardrails, generate the tests, write the documentation and hand a reviewable pull request to a person. That is not a forecast; it is how our own builds run. We installed that pipeline for a ten-engineer practice and it became the default path for new work. Two Android apps that had been scoped for five developers were shipped by one, on the original timeline."),
    ('pq', "The pipeline moves the work from typing to judgement. It does not remove the judgement."),
    ('h2', "What did not change"),
    ('p', "Somebody still decides what to build. Somebody still signs off the increment. A passing test is not a working feature, and an evaluation set still has to be labelled by a person who knows the domain. Every stage we automate ends at a human who can say no, and the stage that pushes a decision to a phone is the one we would never remove."),
    ('h2', "What to do this quarter"),
    ('ol', ["Pick one repo, not the platform.", "Measure first: lead time, pull-request cycle time, review turnaround, incidents. Before any agent touches the code.", "Put the pipeline on one service, with the conventions, CI and review your team already has as the guardrails.", "Let the team run it for a fortnight without us in the room.", "Look at the same numbers, after. If they moved, widen it. If they did not, you have lost six weeks and learned something true."]),
    ('h2', "Where the hype is useful"),
    ('p', "It gets you budget. Spend it on the boring version: a pipeline, a number, a person in the loop. That is the whole offer, and it fits in six weeks."),
]
NOTE_SOW = [
    ('p', "Most statements of work are written to be signed, not read. Twelve pages, a liability section copied from the last one, an hourly estimate per feature that nobody believes, and a signature block. The buyer skims to the number, the seller hopes they do, and the document goes into a folder until something goes wrong."),
    ('p', "Ours is two pages, and it arrives three days after the first call, before any money has changed hands. That is not a courtesy. It is the part of the sale that does the selling, because it is the first piece of work you see from us, and it is work you can check."),
    ('h2', "What goes in"),
    ('p', "Page one is four lists. <b>In</b>: the first increment, written as things a user can do, not as components. <b>Out</b>: everything we discussed that is not in the first increment, by name. <b>Cost</b>: one fixed number for the increment, with the day rate it was built from, so you can do the arithmetic yourself. <b>Acceptance</b>: how we both know an item is done, in your environment, before the invoice."),
    ('p', "Page two is how it runs. The fortnightly review and what it reports: shipped, slipped, cost against plan. Who on your side signs the increment. What happens when scope changes, which it will. And what stops the work: the two or three conditions under which either of us can call it without a conversation about fault."),
    ('h2', "The out list is the page a CTO reads twice"),
    ('p', "Anyone can write the in list; it is the brief, reformatted. The out list is where the thinking shows. It says we understood the whole product, chose a first slice on purpose, and are not going to let the increment quietly grow until the budget is gone. When a head of engineering reads <i>single sign-on: out, increment two</i>, they learn two things at once: we heard it, and we are not pretending it is free."),
    ('pq', "A scope that lists only what is in has made no decisions. It has copied the brief and added a price."),
    ('h2', "What we leave out on purpose"),
    ('ol', ["Hour estimates per feature. They are precise, wrong, and used later as a weapon. The increment has one number.", "A change-request process with forms. Changes go into the next increment, and the fortnightly review is where they are agreed.", "Velocity promises. We commit to a scope and a date, not to points per sprint.", "Liability boilerplate that pretends a two-page scope is a forty-page contract. The contract is a separate document, and it is short too.", "Anything we have not shipped before. If a line would be our first time, it says so, or it is not there."]),
    ('h2', "Why before the money"),
    ('p', "Because it is the cheapest test either side will ever run. Three days of our thinking, free, and you learn whether we understood the problem, whether we can write, and whether we will say no to anything. If the two pages are vague, the next six weeks will be too. If they are sharp, you are holding a document you could hand to any other firm and get a comparable quote, which is the point: a scope you can take elsewhere is a scope you can trust."),
    ('h2', "How to read one, whoever wrote it"),
    ('ol', ["Can you find the first increment without asking? If the answer is <i>everything, in phases</i>, it is a brief, not a scope.", "Does it name what is out? If nothing is out, nothing has been decided.", "Could you check an acceptance line yourself, in your own environment, with nobody from the vendor in the room? If not, done means whatever they say it means."]),
    ('p', "Ours passes those three or it goes back for another day. That is the whole pitch."),
]
NOTE_BODIES = {0: NOTE_AGENTS, 1: NOTE_SOW}
NOTE_OFFER = {0: ("Agentic delivery in six weeks", "One repo, a baseline, the pipeline, the same numbers after.", "SITE_Agentic.dc.html", "Read the offer"),
              1: ("Products built end to end", "A two-page scope three days after the call, a fixed first increment, a fortnightly review you sign.", "SITE_S1_Custom.dc.html", "Read the service")}
NOTE_CLOSE = {0: "Bring one repo. We will show you the Friday after.", 1: "Thirty minutes on the call. Two pages, three days later."}
def note_page(idx=0):
    p = POSTS[idx]; NOTE_BODY = NOTE_BODIES[idx]; off = NOTE_OFFER[idx]
    TONE["t"] = "d"
    hero_h = page_hero("Note &#183; " + p["cat"] + " &#183; [DATE]", p["title"].replace(". ", ".<br>", 1), p["excerpt"])
    TONE["t"] = "l"
    body = ''
    for kind, val in NOTE_BODY:
        if kind == 'p': body += '<p>' + val + '</p>'
        elif kind == 'h2': body += '<h2>' + val + '</h2>'
        elif kind == 'pq': body += '<div class="pq">' + val + '</div>'
        elif kind == 'ol': body += '<ol>' + ''.join('<li>' + x + '</li>' for x in val) + '</ol>'
    toc = [v for k, v in NOTE_BODY if k == 'h2']
    aside = ('<div style="position: sticky; top: 100px; display: flex; flex-direction: column; gap: 28px;"><div>' + lab("In this note") + '<div style="margin-top: 12px; display: flex; flex-direction: column; gap: 8px; font-size: 14px; line-height: 1.5; color: ' + SUB + ';">' + ''.join('<div>&#8212; ' + t + '</div>' for t in toc) + '</div></div>'
             '<div style="border-top: 1px solid ' + LINE + '; padding-top: 20px; display: flex; flex-direction: column; gap: 12px;">' + lab("The offer this note describes") + '<div style="font-size: 18px; font-weight: 600; letter-spacing: -0.02em;">' + off[0] + '</div><div style="font-size: 14px; line-height: 22px; color: ' + DIM + ';">' + off[1] + '</div><a href="' + off[2] + '" class="more" style="text-decoration: none; font-family: ' + MONO + '; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: ' + LIME + ';">' + off[3] + ' &#8594;</a></div>'
             '<div style="border-top: 1px solid ' + LINE + '; padding-top: 20px;">' + btn("Book a consult", "lime", BOOK) + '</div></div>')
    light = ('<div class="wrap" style="padding: 90px 0 120px; display: grid; grid-template-columns: 1fr 300px; gap: 96px; align-items: start;"><article class="art rv">' + body + '<div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid ' + LINE + '; font-family: ' + MONO + '; font-size: 12px; color: ' + DIM + ';">Written by the people who would do the work &#183; <a href="SITE_Notes.dc.html" class="more" style="color: ' + LIME + '; text-decoration: none;">All notes &#8594;</a></div></article><aside class="rv" style="transition-delay: 90ms;">' + aside + '</aside></div>')
    TONE["t"] = "d"
    nxt = ('<div class="wrap"><section style="padding: 100px 0 120px;"><div class="rv" style="display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 20px;">' + h2("Next notes.", 32) + '<a href="SITE_Notes.dc.html" class="more" style="text-decoration: none; font-family: ' + MONO + '; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: ' + LIME + ';">All notes &#8594;</a></div>' + _ledger([(('<a href="' + q["page"] + '" style="color: inherit; text-decoration: none;">' + q["title"] + ' &#8594;</a>') if "page" in q else q["title"], q["excerpt"]) for q in (POSTS[idx + 1:] + POSTS[:idx])[:2]]) + '</section></div>')
    TONE["t"] = "l"; close_h = closing("Notes &#183; the call", NOTE_CLOSE[idx])
    html = wrap(surface("d", hero_h, seam=False) + surface("l", light) + surface("d", nxt) + surface("l", close_h), "Notes")
    return html.replace('<title>Hopsig — Notes</title>', '<title>Hopsig — ' + p["title"] + '</title>')

# ---- Agentic delivery: the six-week offer (the honest version of an "AI transformation" page)
def agentic():
    TONE["t"] = "d"
    facts = [("10", "engineers on the agentic path at a practice we built it for"), ("5 &#8594; 1", "developers needed for two Android apps, same timeline"), ("6 weeks", "one repo, a baseline, the pipeline, the numbers after"), ("Claude Code", "MCP servers, guardrails, generated tests, living docs")]
    hero_h = _hero_btns(page_hero("AI transformation &#183; a six-week engagement", "Your team, shipping with agents.<br>Measured by Friday.", "Not a transformation programme. One repository, a baseline taken in week one, our delivery pipeline installed inside your conventions, your team running it, and the same numbers measured after.", [("Book a consult", BOOK), ("See our work", WORK)]), _facts_row(facts))
    TONE["t"] = "l"
    gets = ["The pipeline on your repo: planning agent, story population, autonomous implementation inside your guardrails, automated review, generated tests, living documentation, human-in-the-loop escalation", "A baseline before anything changes: lead time, pull-request cycle time, review turnaround, incidents, test coverage on new code", "Your conventions as the guardrails: linting, CI, branch rules, review policy, enforced on every change", "Your engineers running it from week three, with us watching; a recorded walkthrough and a week of questions answered", "The same numbers after, in a review you sign; then widen it or stop"]
    no = ["The brief is to replace engineers rather than to ship more with the ones you have", "There is no CI and nobody wants to write the first test", "Nobody on your side can own the decision to widen it or stop"]
    light = ('<div class="wrap" style="padding: 100px 0 0;"><section style="display: grid; grid-template-columns: 1.1fr 1fr; gap: 72px; align-items: start;"><div class="rv" style="display: flex; flex-direction: column; gap: 22px;">' + h2("What you get.", 44) + '<div class="list">' + ''.join('<div><i></i><span>' + g + '</span></div>' for g in gets) + '</div>'
             '<div style="font-family: ' + MONO + '; font-size: 12px; line-height: 1.7; color: ' + DIM + ';">Priced: <span style="color: ' + SUB + ';">Fixed scope, six weeks &#183; [QUOTE] &#183; NET 14</span> &#183; <a href="SITE_Rates.dc.html" class="more" style="color: ' + LIME + '; text-decoration: none; font-family: ' + MONO + '; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase;">See rates &#8594;</a></div></div>'
             '<div class="rv" style="transition-delay: 90ms; display: flex; flex-direction: column; gap: 36px;"><div>' + lab("Good for") + '<div style="margin-top: 12px; display: flex; flex-direction: column; gap: 8px; font-size: 17px; line-height: 1.5;">' + ''.join('<div>&#8212; ' + g + '</div>' for g in ["A team of five to forty engineers with a roadmap longer than the year", "A CTO who has been asked about AI by the board and wants a number, not a slide", "A codebase with CI and review already in place, however imperfect"]) + '</div></div>'
             '<div>' + lab("We will say no when", LIME) + '<div style="margin-top: 12px; display: flex; flex-direction: column; gap: 8px; font-size: 17px; line-height: 1.5; color: ' + SUB + ';">' + ''.join('<div>&#8212; ' + g + '</div>' for g in no) + '</div></div></div></section>'
             + _two_col("Six stages. A person signs every increment.", "The same pipeline that runs every Hopsig build, installed on yours.", _ledger([("Plan", "The build is planned with a solutions-architect agent before code is written. The plan is a document you can object to."), ("Stories", "Epics and stories populated and tracked automatically, in your Jira or ours."), ("Build", "Stories implemented autonomously inside your guardrails, every change checked against them."), ("Review", "Automated review and generated tests before a senior looks. A senior always looks."), ("Document", "Documentation written as the code changes, never a week behind."), ("Escalate", "When a decision needs a person, it is pushed to a phone with the context, and the pipeline waits.")], "44px 150px 1fr"), "The pipeline")
             + '<div style="height: 120px;"></div></div>')
    TONE["t"] = "d"
    steps = [("Week 0", "Read the repo, take the baseline", "Conventions, CI, review policy, and the five numbers as they are today. Written down before anything changes."), ("Week 1", "Pipeline on one service", "Planning, stories, implementation inside your guardrails; the first agent-authored pull request reviewed by your senior."), ("Week 3", "Your team runs it", "We watch, answer and adjust the guardrails. Escalations go to your phone, not ours."), ("Week 6", "The same numbers, after", "Lead time, cycle time, review turnaround, incidents, coverage. In a review you sign. Widen it or stop."), ("Then", "Widen, or not", "The next repo at a fixed price, or a handover with the pipeline staying as it is.")]
    cases = [RECORD[5], RECORD[19], CASES[6], RECORD[18]]
    dark = ('<div class="wrap"><section style="padding: 100px 0 0;"><div class="rv" style="display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 36px;">' + h2("How the six weeks run.", 44) + lab("Fixed scope, fixed price") + '</div>' + _steps(steps) + '</section>'
            '<section style="padding: 100px 0 0;"><div class="rv" style="display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 24px;">' + h2("What we measure.", 44) + lab("Before, in week one; after, in week six") + '</div><div class="rv" style="display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 18px;">' + ''.join('<div style="border-top: 2px solid ' + (LIME if j == 0 else LINE) + '; padding-top: 16px; display: flex; flex-direction: column; gap: 8px;"><div style="font-family: ' + MONO + '; font-size: 11px; color: ' + DIM + ';">0' + str(j + 1) + '</div><div style="font-size: 19px; font-weight: 600; letter-spacing: -0.02em;">' + a + '</div><div style="font-size: 14px; line-height: 22px; color: ' + DIM + ';">' + b + '</div></div>' for j, (a, b) in enumerate([("Lead time", "Idea to production, per story."), ("PR cycle time", "Opened to merged."), ("Review turnaround", "Opened to first senior review."), ("Incidents", "Caused by changes shipped through the pipeline."), ("Coverage on new code", "Tests generated and kept.")])) + '</div></section>'
            '<section style="padding: 100px 0 0;"><style>.phx{color:var(--acc);font-family:' + MONO + ';font-size:12px}</style><div class="rv" style="display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 28px;">' + h2("From the record.", 44) + '<a href="' + WORK + '" class="more" style="text-decoration: none; font-family: ' + MONO + '; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: ' + LIME + ';">All case notes &#8594;</a></div><div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 24px;">' + ''.join(case_card(j, *c) for j, c in enumerate(cases)) + '</div></section>'
            + _faq([("Does this replace engineers?", "No. It changes what they spend the day on. The practice we built it for kept its ten engineers and shipped more; the two-apps-by-one-developer result freed four people for other work, it did not remove them."), ("Which models and tools?", "Claude Code with MCP servers for the pipeline, your existing CI and review tooling as the guardrails. Model choice is whatever passes your eval at a cost you accept; the pipeline does not care about the logo."), ("Does our code leave the building?", "It runs in your repo and your accounts. Model calls go through a provider with no training on your data, or through your own cloud account if you prefer; we write down which, in the SOW."), ("What if the numbers do not move?", "Then you stop at week six, the pipeline stays if you want it, and you have a measured answer instead of an opinion. That outcome is in the SOW too.")]) +
            '<div style="height: 120px;"></div></div>')
    TONE["t"] = "l"; close_h = closing("AI transformation &#183; the call", "Bring one repo. We will show you the Friday after.")
    html = wrap(surface("d", hero_h, seam=False) + surface("l", light) + surface("d", dark) + surface("l", close_h), "Agentic")
    return html.replace('<title>Hopsig — Agentic</title>', '<title>Hopsig — AI transformation</title>')

# ---- For agencies
def agencies():
    TONE["t"] = "d"
    facts = [("White-label", "your brand on the SOW, our engineers behind it"), ("NDA", "by default, before the first conversation"), ("Your client", "your relationship; we never contact them without you"), ("10 days", "to first commit, the same as a direct engagement")]
    hero_h = _hero_btns(page_hero("For agencies &#183; white-label delivery", "Your brand on the SOW.<br>Our engineers behind it.", "Design and product agencies sell the work and own the client. We scope it with you, build it under your name, and hand it over the way you would have.", [("Book a consult", BOOK), ("See our work", WORK)]), _facts_row(facts))
    TONE["t"] = "l"
    light = ('<div class="wrap" style="padding: 100px 0 0;"><section><div class="rv">' + h2("How it works.", 44) + '</div><div style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 24px; margin-top: 40px;">' +
             ''.join('<div class="rv" style="transition-delay: ' + str(i * 90) + 'ms; border-top: 2px solid ' + (LIME if i == 0 else LINE) + '; padding-top: 18px; display: flex; flex-direction: column; gap: 10px;"><div style="font-family: ' + MONO + '; font-size: 11px; color: ' + DIM + ';">0' + str(i + 1) + '</div><div style="font-size: 22px; font-weight: 600; letter-spacing: -0.03em;">' + a + '</div><div style="font-size: 15px; line-height: 25px; color: ' + DIM + ';">' + b + '</div></div>' for i, (a, b) in enumerate([("You sell, you own the client", "The pitch, the relationship and the invoice to the end client are yours. We are a line item you control."), ("We scope it with you", "A two-page SOW in your template, three days after the call, with our engineering estimate inside your price."), ("We deliver under your name", "Your repo or theirs, your standup, your Slack. Our engineers appear as your team; the handover pack carries your logo.")])) + '</div></section>'
             + _two_col("What you get.", "", '<div class="list">' + ''.join('<div><i></i><span>' + g + '</span></div>' for g in ["An agency rate card: [YOUR RATE] less [AGENCY DISCOUNT] per day, so there is margin without padding the scope", "Named senior engineers you can put in front of your client as yours", "Our estimate inside your SOW, in your template, with our name nowhere on it unless you want it there", "Mutual non-solicitation for twelve months, in writing", "A fortnightly review with you, not with your client, unless you invite us", "Capacity notice: four weeks ahead for a new engagement, ten working days for one more engineer on a running one"]) + '</div>', "Terms")
             + _two_col("We will say no when", "", '<div style="display: flex; flex-direction: column; gap: 10px; font-size: 17px; line-height: 1.5; color: ' + SUB + ';">' + ''.join('<div>&#8212; ' + g + '</div>' for g in ["You want us to present as your in-house team to a client who asks directly; we will stay quiet, we will not lie", "The scope is already sold at a price that cannot carry senior people", "Your client needs us more than you do, and nobody has said so"]) + '</div>')
             + '<div style="height: 120px;"></div></div>')
    TONE["t"] = "d"
    dark = ('<div class="wrap">' + _faq([("Will you ever go around us?", "No. Mutual non-solicitation is in the agreement, and if your client contacts us directly we tell you the same day and point them back to you."), ("Can our designers work with your engineers directly?", "Yes, and it is better when they do. Figma to production is a conversation, not a handover; we have shipped design systems with product teams this way."), ("What if the client's scope changes under us?", "It goes through you. We re-estimate inside your template, you re-price to your client, and the fortnightly review shows both of us the cost against plan."), ("Do you take a share of the margin?", "No. You pay the agency day rate; what you charge your client is yours.")], "Questions agencies ask.") + '<div style="height: 120px;"></div></div>')
    TONE["t"] = "l"; close_h = closing("Agencies &#183; the call", "Bring the pitch you are about to lose on capacity.")
    html = wrap(surface("d", hero_h, seam=False) + surface("l", light) + surface("d", dark) + surface("l", close_h), "Agencies")
    return html.replace('<title>Hopsig — Agencies</title>', '<title>Hopsig — For agencies</title>')

# ---- Join
def join():
    TONE["t"] = "d"
    facts = [("Senior only", "years shipping to production, not years in the industry"), ("09:00&#8211;13:00 GMT", "the overlap, every working day; the rest is yours"), ("One account", "at a time; no bench, no two clients"), ("Lahore", "remote within Pakistan; [OFFICE DAYS]")]
    hero_h = page_hero("Join &#183; for engineers", "Senior only<br>means something.", "We put engineers inside clients' teams in the UK, US and EU, or build for them end to end. The bar is higher than most shops, the work is in production from day ten, and nobody is on a bench.", [("Send us the system you are proudest of", "SITE_Brief.dc.html")])
    hero_h = hero_h.replace('<div class="chips"><a class="chip2" href="SITE_Brief.dc.html">Send us the system you are proudest of</a></div>', '<div style="display: flex; align-items: center; gap: 14px; margin-top: 6px;">' + btn("Send us the system you are proudest of", "lime", "SITE_Brief.dc.html") + '</div>' + _facts_row(facts))
    TONE["t"] = "l"
    light = ('<div class="wrap" style="padding: 100px 0 0;">' + _two_col("What the work is like.", "", _ledger([("In a client's standup", "From day ten you are in their standup, on their repo and their board. We manage you; they direct the work. You are never the junior in the room."), ("One account at a time", "No context-switching between three clients. When an engagement ends there is a planned gap, not a bench."), ("Agentic delivery", "Every build runs on our Claude Code pipeline: you plan with an agent, review what it writes, and decide. You will write less boilerplate and more judgement."), ("Reviewed by a senior", "Every change is reviewed by a second senior before it lands, yours included. That is the quality bar, not a hierarchy."), ("Four hours, then your day", "The overlap with GMT is 09:00 to 13:00 Lahore time, the same four hours every day. Afternoons are deep work, not meetings.")], "44px 220px 1fr"), "The work")
             + _two_col("How we vet.", "Five steps, two weeks, no whiteboard puzzles.", _ledger([("The system", "Send us something you shipped and owned in production: what it did, what broke, what you would do differently."), ("The conversation", "An hour on that system with one of us. We go deep on one thing rather than wide on everything."), ("A paid day", "A real problem from a real engagement, paid at the day rate, with the pipeline. We look at the judgement, not the speed."), ("References", "Two people who have shipped with you. We call them."), ("The offer", "Written, with the band, the overlap and the first engagement if there is one lined up.")]), "Vetting")
             + '<section style="padding-top: 100px;"><div class="rv" style="display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 24px;">' + h2("Roles we hire for.", 44) + lab("[OPEN / PIPELINE] &#183; set per role") + '</div><div class="rv" style="border-top: 1px solid ' + LINE + ';">' + ''.join('<div style="display: grid; grid-template-columns: 44px 1fr 1fr auto; gap: 20px; align-items: baseline; padding: 18px 0; border-bottom: 1px solid ' + LINE + ';"><span style="font-family: ' + MONO + '; font-size: 11px; letter-spacing: 0.12em; color: ' + LIME + ';">0' + str(j + 1) + '</span><span style="font-size: 19px; font-weight: 600; letter-spacing: -0.02em;">' + a + '</span><span style="font-size: 14px; line-height: 22px; color: ' + SUB + ';">' + b + '</span><span style="font-family: ' + MONO + '; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: ' + DIM + ';">[STATUS]</span></div>' for j, (a, b) in enumerate([("Senior backend engineer", ".NET, Node.js or Python; owned a production system; comfortable in someone else's codebase"), ("Senior frontend engineer", "React or Angular, with the design-system discipline to keep three brands one product"), ("Data engineer", "Pipelines that run without you; warehouse, semantic layer, dashboards people open"), ("AI engineer", "Retrieval, evaluation harnesses, agents on Claude Code and MCP; a number before a demo"), ("Mobile engineer", "Kotlin, AOSP or cross-platform; store-ready, offline-first where it matters")])) + '</div>'
             '<div class="rv" style="margin-top: 26px; font-family: ' + MONO + '; font-size: 12px; line-height: 1.8; color: ' + DIM + ';">Pay: [PAY BANDS BY LEVEL] &#183; paid monthly in [PKR / USD] &#183; equipment provided &#183; [LEAVE POLICY]</div></section><div style="height: 120px;"></div></div>')
    TONE["t"] = "d"
    dark = ('<div class="wrap">' + _faq([("Do I have to be in Lahore?", "Remote within Pakistan is fine; the overlap hours are what matter. [OFFICE DAYS, IF ANY]."), ("What happens between engagements?", "A planned gap: paid, with a date for the next start. We staff for engagements, so gaps are short and known in advance; we do not run a bench."), ("Will I be a contractor or an employee?", "[EMPLOYMENT MODEL]. Written in the offer, with the band and the notice period."), ("Can I say no to a client?", "Yes, before you start. You meet the client before day one, and so do they; either side can say no.")], "Questions engineers ask.") + '<div style="height: 120px;"></div></div>')
    TONE["t"] = "l"; close_h = closing("Join &#183; the first step", "Send us the system you are proudest of.")
    close_h = close_h.replace(btn("Book a consult", "lime", BOOK), btn("Send it", "lime", "SITE_Brief.dc.html")).replace("Bring the problem, not a brief. If it is outside what we do well, we will say which of our contacts to call instead.", "What it did, what broke, what you would do differently. A link and three paragraphs is enough.")
    html = wrap(surface("d", hero_h, seam=False) + surface("l", light) + surface("d", dark) + surface("l", close_h), "Join")
    return html

# ---- Working with us (the procurement page)
def working():
    TONE["t"] = "d"
    hero_h = _hero_btns(page_hero("Working with us", "The paperwork,<br>in one page.", "What procurement asks before the first invoice: contracts, IP, data, security, insurance, invoicing. Placeholders are marked; we would rather show a gap than a badge.", [("Book a consult", BOOK), ("See our work", WORK)]))
    TONE["t"] = "l"
    secs = [("Contracts", "A master services agreement once, a two-page SOW per engagement. Thirty days&#8217; notice either side, no minimum beyond the first three months on embedded work, no automatic renewal. Your paper or ours. <span class=\"phx\">[MSA TEMPLATE LINK]</span>"),
            ("Intellectual property", "Yours on payment of each invoice. Code lives in your repository from day one; we keep nothing except what we have learned. Open-source licences used are listed in the handover pack."),
            ("Your data", "We work in your cloud account under least-privilege access that you grant and revoke. No production data on laptops; no copies outside your estate; access removed at handover and confirmed in writing. For UK and EU clients we sign your DPA or supply ours. <span class=\"phx\">[DPA LINK]</span>"),
            ("Security practices", "Two-factor authentication on every account, secrets in a manager and never in a repo, dependency scanning in CI, every change reviewed by a second senior, no shared accounts. Certifications: <span class=\"phx\">[NONE YET / LIST]</span>; we will say so plainly rather than imply otherwise."),
            ("Where the work happens", "Delivery in Lahore, Pakistan, with four hours of daily overlap with GMT (shifted for US teams and written into the SOW). Model and AI tooling runs through providers that do not train on your data, or inside your own cloud account; the SOW states which."),
            ("Insurance", "Professional indemnity: <span class=\"phx\">[INSURER &#183; COVER AMOUNT]</span>. Certificate available on request."),
            ("Invoicing", "Monthly in arrears for embedded work, per increment for built work. NET 14. GBP, USD or EUR by bank transfer. <span class=\"phx\">[VAT / TAX STATUS]</span> &#183; <span class=\"phx\">[BANK COUNTRY]</span>."),
            ("Subcontracting", "None without your written consent. The engineers on your SOW are the engineers on your account."),
            ("The company", "Hopsig Technologies, <span class=\"phx\">[LEGAL FORM]</span>, registered in Pakistan, <span class=\"phx\">[COMPANY REG NO.]</span>, established <span class=\"phx\">[YEAR]</span>. Registered office: <span class=\"phx\">[ADDRESS]</span>.")]
    light = ('<div class="wrap" style="padding: 100px 0 0;"><style>.phx{color:var(--acc);font-family:' + MONO + ';font-size:12px}</style>' + _two_col("Everything a buyer checks.", "Nine items. If yours is not here, ask on the call and we will add it to this page.", _ledger(secs, "44px 200px 1fr"), "The list") + '<div style="height: 120px;"></div></div>')
    TONE["t"] = "d"
    dark = ('<div class="wrap"><section style="padding: 100px 0 120px;"><div class="rv" style="display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 24px;">' + h2("What we ask of you.", 44) + lab("Three things, all in week one") + '</div><div style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 24px;">' +
            ''.join('<div class="rv" style="transition-delay: ' + str(i * 90) + 'ms; border-top: 2px solid ' + (LIME if i == 0 else LINE) + '; padding-top: 18px; display: flex; flex-direction: column; gap: 10px;"><div style="font-size: 22px; font-weight: 600; letter-spacing: -0.03em;">' + a + '</div><div style="font-size: 15px; line-height: 25px; color: ' + DIM + ';">' + b + '</div></div>' for i, (a, b) in enumerate([("A named decision-maker", "One person who can say yes to a scope and no to a change. Not a committee."), ("Access in week one", "Repo, cloud account, board, and whoever owns the thing we are touching. Day ten is only possible if day one happens."), ("Fifteen minutes a fortnight", "The review. Shipped, slipped, cost against plan. It is the whole governance model.")])) + '</div></section></div>')
    TONE["t"] = "l"; close_h = closing("Working with us &#183; the call", "Send this page to procurement. Then book the call.")
    html = wrap(surface("d", hero_h, seam=False) + surface("l", light) + surface("d", dark) + surface("l", close_h), "Working")
    return html.replace('<title>Hopsig — Working</title>', '<title>Hopsig — Working with us</title>')

# ---- Send a brief
def brief():
    TONE["t"] = "d"
    steps = [("01", "We read it the same day", "By the people who would do the work. Not a sales queue."), ("02", "A reply inside one working day", "Yes, no, or three questions. If no, we say who to call instead."), ("03", "A scope in three days, if yes", "Two pages: in, out, cost. Before you pay anything.")]
    html = ('<section class="ph"><canvas id="heroCanvas" aria-hidden="true" data-drift="1"></canvas><div class="wrap c book"><div style="display: flex; flex-direction: column; gap: 24px;">' + lab("Send a brief", LIME) +
            '<h1 style="margin: 0; font-size: 64px; font-weight: 600; line-height: 1.02; letter-spacing: -0.05em;">Prefer writing<br>to talking?</h1>'
            '<p style="margin: 0; max-width: 520px; font-size: 19px; line-height: 31px; color: ' + SUB + ';">Four paragraphs at eleven at night is a fine way to start. Tell us the problem the way you would tell a colleague; we will come back with a yes, a no, or three questions.</p>'
            '<div style="display: flex; flex-direction: column; gap: 0; margin-top: 12px; max-width: 520px;">' + ''.join('<div class="rv" style="display: grid; grid-template-columns: 40px 1fr; gap: 14px; padding: 18px 0; border-top: 1px solid ' + LINE + ';"><div style="font-family: ' + MONO + '; font-size: 12px; color: ' + LIME + ';">' + n + '</div><div><div style="font-size: 19px; font-weight: 600; letter-spacing: -0.02em;">' + t + '</div><div style="font-size: 15px; line-height: 24px; color: ' + DIM + '; margin-top: 4px;">' + d + '</div></div></div>' for n, t, d in steps) + '</div>'
            '<div style="font-family: ' + MONO + '; font-size: 12px; color: ' + DIM + '; line-height: 1.8;">Prefer talking? <a href="' + BOOK + '" class="more" style="color: ' + LIME + '; text-decoration: none; padding: 4px 0;">Book a consult &#8594;</a><br>Build note: posts to [FORM ENDPOINT]; a copy lands in Sanity as a <span style="color: ' + SUB + ';">brief</span> document and in [INBOX].</div></div>'
            '<div id="bf" class="cal brief"><div class="live" style="display: flex; flex-direction: column; gap: 14px;"><div style="display: flex; justify-content: space-between; align-items: baseline;">' + lab("The brief") + lab("5 minutes", LIME) + '</div>'
            '<div class="f"><input id="bName" placeholder="Your name"><input id="bEmail" placeholder="Work email"><input id="bCo" placeholder="Company &#183; team size"><div class="lbl">The problem</div><textarea id="bWhat" placeholder="What is not working, who it hurts, what you have tried"></textarea><div class="lbl">When it needs to exist</div><div class="chips2" id="bWhen"><button data-v="this-quarter">This quarter</button><button data-v="next-quarter">Next quarter</button><button data-v="no-date">No date yet</button></div><div class="lbl">Rough budget, if you have one</div><input id="bBudget" placeholder="Optional &#183; a range is fine"><input id="bLink" placeholder="A link, if there is a doc"></div>'
            '<button id="briefBtn" class="btnp">Send the brief</button></div>'
            '<div class="confirm">' + lab("Received", LIME) + '<div style="font-size: 26px; font-weight: 600; letter-spacing: -0.03em; line-height: 1.2;">We will read it today.</div><div style="font-family: ' + MONO + '; font-size: 12px; line-height: 1.8; color: ' + DIM + ';">A reply goes to <span id="bMail" style="color: ' + TEXT + ';"></span> inside one working day.<br>If we are not the right people, we will say who is.</div><div class="list" style="margin-top: 6px;"><div><i></i><span>Read by the people who would do the work</span></div><div><i></i><span>No sales call unless you ask for one</span></div><div><i></i><span>Scope in three days if it is a yes</span></div></div></div></div></div></section>')
    hero_h = html; TONE["t"] = "l"
    strip = ('<section class="wrap" style="padding: 120px 0 140px;"><div class="rv" style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid ' + LINE + '; border-bottom: 1px solid ' + LINE + '; padding: 22px 0; font-family: ' + MONO + '; font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase; color: ' + DIM + ';">' + ''.join('<span>' + x + '</span>' for x in ["No salespeople", "Read the same day", "Reply in one working day", "Scope in 3 days", "Lahore &#183; GMT+5"]) + '</div></section>')
    return wrap(surface("d", hero_h, seam=False) + surface("l", strip), "Brief").replace('<title>Hopsig — Brief</title>', '<title>Hopsig — Send a brief</title>')

# ---- Why not just hire?
def compare():
    TONE["t"] = "d"
    hero_h = _hero_btns(page_hero("Why not just hire?", "Fair question.<br>Here is the honest table.", "Sometimes you should hire. Sometimes a freelancer is right. This page says when, including when it is not us.", [("Book a consult", BOOK), ("See our work", WORK)]))
    TONE["t"] = "l"
    rows = [("First commit", "After the recruiting cycle", "After the statement of work and the bench", "Days, if you find the right one", "10 working days"),
            ("Who you get", "Whoever applied", "Whoever was free", "One person, as good as their last job", "Named senior engineers you interview first"),
            ("Who manages them", "You", "An account manager", "You", "We manage the person; you direct the work"),
            ("Leaving", "Notice period, severance, a gap", "Contract term, often a year", "Whenever, both ways", "30 days, either side"),
            ("IP and code", "Yours", "Check the MSA", "Check the contract", "Yours on payment, in your repo from day one"),
            ("Overlap with your day", "All of it", "Depends on the delivery centre", "Depends on the person", "Four hours with GMT, every day, the same four"),
            ("Cost shape", "Salary, taxes, equipment, recruiter fee, ramp-up", "Blended rate, minimum team size", "Day rate; no cover when they are ill", "Day rate; cover and holidays handled; no recruiter fee"),
            ("Right choice when", "The work is permanent and core", "You need forty people and a programme office", "A fortnight of specialist work", "Three to twelve months of senior capacity, measured")]
    table = ('<div class="cmp rv"><div class="hd"><span></span><span>Hire in-house</span><span>Big outsourcer</span><span>Freelancers</span><span>Hopsig</span></div>' + ''.join('<div>' + ''.join('<span>' + c + '</span>' for c in r) + '</div>' for r in rows) + '</div>')
    light = ('<div class="wrap" style="padding: 100px 0 0;"><div class="rv" style="display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 28px;">' + h2("Four ways to get the work done.", 44) + lab("The last column is us; the other three are fair") + '</div>' + table +
             '<section id="est" class="est rv" style="margin-top: 100px;"><div>' + lab("Put a number on it", LIME) + '<div style="font-size: 26px; font-weight: 600; letter-spacing: -0.03em; margin: 12px 0 28px;">Engineers and months. The total is the total.</div>'
             '<label><span>Engineers</span><span id="oEng">2 engineers</span></label><input id="eng" type="range" min="1" max="6" value="2"><label><span>Months</span><span id="oMon">6 months</span></label><input id="mon" type="range" min="3" max="12" value="6">'
             '<div style="font-size: 13px; line-height: 21px; color: ' + DIM + ';">21 working days a month. No onboarding fee, no recruiter fee, no notice-period buyout. Compare it with a hire: salary plus employer taxes, equipment, a recruiter fee and the months before the first commit.</div></div>'
             '<div class="out">' + lab("Engineer-days") + '<div class="n" id="oDays">252 engineer-days</div>' + lab("Total") + '<div class="n" id="oCost" style="font-size: 30px; color: ' + LIME + ';">&#8212;</div><div style="font-family: ' + MONO + '; font-size: 12px; line-height: 1.8; color: ' + DIM + '; margin-top: 8px;">At [YOUR RATE] a day &#183; invoiced monthly in arrears<br>NET 14 &#183; 30 days&#8217; notice, either side</div></div></section><div style="height: 120px;"></div></div>')
    TONE["t"] = "d"
    dark = ('<div class="wrap">' + _faq([("When should we hire instead?", "When the work is permanent and core to the product, and you can wait for the right person. We will say so on the call; we would rather lose the engagement than have you rent what you should own."), ("When is a big outsourcer right?", "When you need forty people, a programme office and someone to blame. We are not that, and we do not pretend to be."), ("When is a freelancer right?", "A fortnight of specialist work with a clear end. For three months or more, the cover, the review and the handover start to matter, and that is where we come in."), ("Can we convert an engineer to a hire later?", "Yes. After six months there is no fee; before that, one month of the day rate. We would rather you had the person than a clause.")], "The questions behind the question.") + '<div style="height: 120px;"></div></div>')
    TONE["t"] = "l"; close_h = closing("Rates &#183; the call", "If the table says hire, we will say so too.")
    html = wrap(surface("d", hero_h, seam=False) + surface("l", light) + surface("d", dark) + surface("l", close_h), "Rates")
    return html.replace('<title>Hopsig — Rates</title>', '<title>Hopsig — Why not just hire?</title>')

# ---- Legal: drafts for counsel, with placeholders where the facts are the company's
def _legal(title, sub, sections, active):
    TONE["t"] = "d"
    hero_h = page_hero("Draft for counsel&#8217;s review", title, sub)
    TONE["t"] = "l"
    body = ''.join('<h2>' + h + '</h2>' + ''.join(('<p>' + x + '</p>') if not isinstance(x, list) else ('<ul>' + ''.join('<li>' + y + '</li>' for y in x) + '</ul>') for x in parts) for h, parts in sections)
    light = ('<div class="wrap" style="padding: 80px 0 120px; display: grid; grid-template-columns: 1fr 260px; gap: 96px; align-items: start;"><article class="legal rv"><style>.phx{color:var(--acc);font-family:' + MONO + ';font-size:12px}</style>' + body + '</article>'
             '<aside class="rv" style="transition-delay: 90ms; position: sticky; top: 100px; display: flex; flex-direction: column; gap: 20px;">' + lab("Contents") + '<div style="display: flex; flex-direction: column; gap: 8px; font-size: 14px; line-height: 1.5; color: ' + SUB + ';">' + ''.join('<div>&#8212; ' + h + '</div>' for h, _ in sections) + '</div><div style="border-top: 1px solid ' + LINE + '; padding-top: 16px; font-family: ' + MONO + '; font-size: 11px; line-height: 1.8; color: ' + DIM + ';">Last updated [DATE]<br>Questions: [HELLO@HOPSIG.COM]</div></aside></div>')
    return wrap(surface("d", hero_h, seam=False) + surface("l", light), active)

def privacy():
    PH = lambda t: '<span class="phx">[' + t + ']</span>'
    secs = [("Who we are", ["Hopsig Technologies, " + PH("LEGAL FORM") + ", registered in Pakistan under " + PH("COMPANY REG NO.") + ", registered office " + PH("ADDRESS") + ". For the purposes of UK and EU data protection law we are the controller of the personal data described on this page. Contact: " + PH("HELLO@HOPSIG.COM") + "."]),
            ("What we collect, and why", ["When you book a call or send a brief we collect your name, work email, company, team size and whatever you write about the problem. We use it to reply to you and, if we work together, to scope the engagement. Lawful basis: our legitimate interest in responding to an enquiry you made, and performance of a contract once there is one.", "When you browse the site we collect the usual server logs (IP address, browser, pages requested) and, if you accept them, analytics cookies from " + PH("ANALYTICS TOOL") + ". Lawful basis: legitimate interest for logs; consent for analytics.", "We do not buy lists, we do not run advertising pixels, and we do not sell or share your data with anyone for their own purposes."]),
            ("Cookies", ["Essential cookies keep the site working and remember a choice you made. Analytics cookies are off until you accept them, and you can withdraw at any time from the cookie notice in the footer. The full list: " + PH("COOKIE TABLE") + "."]),
            ("Who sees it", ["The people at Hopsig who would do the work. Our processors: " + PH("HOSTING PROVIDER") + " (hosting), " + PH("CMS PROVIDER") + " (content and form storage), " + PH("EMAIL PROVIDER") + " (email), " + PH("BOOKING TOOL") + " (scheduling), " + PH("ANALYTICS TOOL") + " (analytics, with consent). Each is bound by a data-processing agreement."]),
            ("Where it goes", ["We are in Pakistan; our processors are in " + PH("REGIONS") + ". Transfers from the UK and EU rely on " + PH("IDTA / SCCs / ADEQUACY") + ", and we will provide the documentation on request."]),
            ("How long we keep it", ["Enquiries and briefs: " + PH("RETENTION PERIOD") + " from the last contact, then deleted. Client engagement records: for the term of the contract plus " + PH("PERIOD") + " for tax and legal reasons. Server logs: " + PH("PERIOD") + ". Analytics: per the tool's setting, " + PH("PERIOD") + "."]),
            ("Your rights", [["Access the personal data we hold about you", "Correct it", "Have it erased, where we no longer need it", "Object to processing based on legitimate interest", "Restrict processing while a dispute is resolved", "Receive it in a portable format", "Withdraw consent for analytics at any time"], "Write to " + PH("HELLO@HOPSIG.COM") + ". We reply within one month. You can also complain to your supervisory authority; in the UK that is the Information Commissioner&#8217;s Office."]),
            ("Changes", ["We will update this page when the facts change and put the date at the top. We will not change the lawful basis for data we already hold without telling you."])]
    return _legal("Privacy.<br>Short, because there is not much to say.", "We collect what you give us when you ask to talk, and the usual logs. Nothing is sold, nothing is shared for advertising, and the analytics are off until you say yes.", secs, "Privacy")

def terms():
    PH = lambda t: '<span class="phx">[' + t + ']</span>'
    secs = [("These terms", ["These terms cover your use of hopsig.com. Work we do for you is governed by a master services agreement and a statement of work, not by this page. If anything here conflicts with a signed agreement, the agreement wins."]),
            ("Using the site", ["You may read, link to and quote the site with attribution. You may not scrape it, mirror it, or use it to train a model without written permission. Do not try to break it; if you find something broken, tell us at " + PH("HELLO@HOPSIG.COM") + " and we will thank you."]),
            ("What is ours", ["The design, the writing and the code of the site are ours unless marked otherwise. Case notes describe work done for clients whose names are withheld; nothing on the site grants a licence to their systems or data. Third-party names appear only to describe tooling we have used."]),
            ("No promises", ["The site is a description of how we work, not an offer capable of acceptance. Figures on the site come from our delivery record and are marked where a number is still to be added. We update them when they change; we do not guarantee they are current on the day you read them. Nothing here is advice."]),
            ("Liability", ["To the extent the law allows, we are not liable for loss arising from your use of the site. Nothing excludes liability that cannot be excluded by law. Our liability for work done for you is set out in the signed agreement for that work."]),
            ("Governing law", ["These terms are governed by the law of " + PH("JURISDICTION") + ", and its courts have exclusive jurisdiction. Signed agreements may choose a different law; the agreement wins."]),
            ("Changes", ["We may change these terms; the date at the top tells you when. Continued use after a change means you accept it."])]
    return _legal("Terms of use.<br>For the site, not the work.", "The engagement terms live in the MSA and the SOW. This page is only about reading hopsig.com.", secs, "Terms")

# ---- 404
def notfound():
    TONE["t"] = "d"
    html = ('<section class="close" style="min-height: 100vh;"><canvas id="closeCanvas" aria-hidden="true" data-tone="d"></canvas><div class="c">' + lab("404 &#183; not here", LIME) +
            '<h1 style="margin: 0; font-size: 72px; font-weight: 600; line-height: 1.02; letter-spacing: -0.05em; max-width: 760px;">That page moved,<br>or never shipped.</h1>'
            '<p style="margin: 0; max-width: 520px; font-size: 17px; line-height: 29px; color: ' + SUB + ';">Try the services, the industries or the case notes. Or skip all of that: the call is still thirty minutes.</p>'
            '<div style="display: flex; align-items: center; gap: 14px; margin-top: 8px;">' + btn("Home", "lime", "SITE_Home.dc.html") + btn("Book a consult", "outline", BOOK) + btn("See our work", "outline", WORK) + '</div></div></section>')
    return wrap(surface("d", html, seam=False), "404").replace('<title>Hopsig — 404</title>', '<title>Hopsig — Not found</title>')

# ---- Case note pages: one per case study, from the same data as the index and the Work page
CASE_PAGES = [("F", 0, "SITE_Case_Payments.dc.html"), ("C", 1, "SITE_Case_Preclinical.dc.html"), ("C", 2, "SITE_Case_Freight.dc.html")]
def case_page(key, idx, fn):
    dom, title, prob, did, meas, stack, shape = (RECORD if key == "F" else CASES)[idx]
    met = next((f["metric"] for f in FEATURED if f["src"] == (key, idx)), None)
    TONE["t"] = "d"
    facts = [((met["value"], met["label"]) if met else ("[ADD THE NUMBER]", "the measured outcome, once the record has it")), (shape, "engagement shape"), (dom, "domain"), ("Withheld", "client name; details on the call")]
    hero_h = page_hero("Case note &#183; " + dom, title, prob, [("Ask about this", BOOK), ("All case notes", WORK)])
    hero_h = hero_h.replace('<div class="chips"><a class="chip2" href="' + BOOK + '">Ask about this</a><a class="chip2" href="' + WORK + '">All case notes</a></div>', '<div style="display: flex; align-items: center; gap: 14px; margin-top: 6px;">' + btn("Ask about this", "lime", BOOK) + btn("All case notes", "outline", WORK) + '</div>' + _facts_row(facts).replace('font-size: 26px;', 'font-size: 22px;'))
    TONE["t"] = "l"
    card = ('<div style="position: sticky; top: 100px; display: flex; flex-direction: column; gap: 20px;"><div style="background: ' + INK + '; color: ' + TEXT + '; border-radius: 12px; padding: 24px 26px; display: flex; flex-direction: column; gap: 8px;">' + lab("Measured", DIM) + '<div style="font-size: 44px; font-weight: 600; letter-spacing: -0.045em; line-height: 1; color: ' + LIME + ';">' + (met["value"] if met else '&#8212;') + '</div><div style="font-size: 13px; line-height: 20px; color: ' + SUB + ';">' + (met["label"] if met else 'Number to be added from the record.') + '</div></div>'
            '<div class="list">' + ''.join('<div><i></i><span><span style="color: ' + DIM + ';">' + a + ' &#8212; </span>' + b + '</span></div>' for a, b in [("Shape", shape), ("Domain", dom), ("Client", "Withheld; named on the call")]) + '</div>' + btn("Ask about this on the call", "lime", BOOK) +
            '<div style="font-family: ' + MONO + '; font-size: 11px; line-height: 1.8; color: ' + DIM + ';">Source: Sanity &#183; caseStudy &#183; <span style="color: ' + SUB + ';">/work/' + fn.replace('SITE_Case_', '').replace('.dc.html', '').lower() + '</span></div></div>')
    light = ('<div class="wrap" style="padding: 90px 0 120px; display: grid; grid-template-columns: 1fr 320px; gap: 96px; align-items: start;"><style>.phx{color:var(--acc);font-family:' + MONO + ';font-size:12px}</style><article class="art rv">' +
             '<h2 style="margin-top: 0;">Problem</h2><p>' + prob + '</p><h2>What we did</h2><p>' + did + '</p><h2>Measured</h2><p>' + meas + '</p>'
             '<div style="margin-top: 30px;">' + lab("Stack") + '<div style="margin-top: 10px; display: flex; flex-wrap: wrap; gap: 6px;">' + ''.join('<span style="font-family: ' + MONO + '; font-size: 11px; letter-spacing: 0.06em; color: ' + SUB + '; border: 1px solid ' + LINE + '; border-radius: 6px; padding: 6px 9px;">' + c + '</span>' for c in stack) + '</div></div></article><aside class="rv" style="transition-delay: 90ms;">' + card + '</aside></div>')
    word = dom.split(' ')[0].rstrip('&;').lower()
    related = [c for c in (RECORD + CASES) if c[0].lower().startswith(word) and c[1] != title][:3] or [c for c in RECORD[:3] if c[1] != title]
    TONE["t"] = "d"
    dark = ('<div class="wrap"><section style="padding: 100px 0 120px;"><div class="rv" style="display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 20px;">' + h2("More from the record.", 32) + '<a href="' + WORK + '" class="more" style="text-decoration: none; font-family: ' + MONO + '; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: ' + LIME + ';">All ' + str(len(RECORD) + len(CASES)) + ' &#8594;</a></div><div style="border-top: 1px solid ' + LINE + ';">' + ''.join(_case_row(j + 1, c) for j, c in enumerate(related)) + '</div></section></div>')
    TONE["t"] = "l"; close_h = closing("This case &#183; the call", "Ask about this one. We will say what we would do differently.")
    html = wrap(surface("d", hero_h, seam=False) + surface("l", light) + surface("d", dark) + surface("l", close_h), "Work")
    return html.replace('<title>Hopsig — Work</title>', '<title>Hopsig — ' + title + '</title>')

# ------------------------------------------------------------------ AGENTIC FLOW (how a story becomes a pull request)
FLOW_STAGES = [
    ("Plan", "Solutions-architect agent", "A brief in plain language, the repo, your conventions", "A plan: components, risks, the order of work", "Nothing is built from a plan a person has not read", True, "You read the plan and object before any code exists."),
    ("Stories", "Story agent", "The approved plan", "Epics and stories in your Jira or ours, with acceptance criteria", "Every story traces to a line in the plan", False, ""),
    ("Build", "Implementation agent", "One story, your codebase, your guardrails", "A branch with the change, inside your conventions", "Lint, CI, branch rules and review policy, enforced on every change", False, ""),
    ("Review", "Review and test agents", "The branch", "A reviewed diff with generated tests, and a pull request", "A senior always looks before it merges", True, "A senior engineer reviews the pull request. Agents never merge to main."),
    ("Document", "Docs agent", "The merged change", "Documentation updated as the code changed", "Docs live with the code, never a handover task", False, ""),
    ("Escalate", "Escalation agent", "Any decision outside the guardrails", "A question pushed to a phone, with the context, while the pipeline waits", "No guess where a person should decide", True, "A person answers; the pipeline resumes or stops."),
]
def _flow_svg():
    W, H = 1264, 300; n = len(FLOW_STAGES); gap = 22; bw = (W - gap * (n - 1)) / n; y = 96; bh = 118
    out = ['<svg class="flow" viewBox="0 0 ' + str(W) + ' ' + str(H) + '" width="100%" role="img" aria-label="The six stages of the agentic pipeline, with the three points where a person signs">']
    out.append('<defs><pattern id="fd" width="11" height="11" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" fill="var(--dot)"/></pattern></defs>')
    out.append('<rect x="0" y="0" width="' + str(W) + '" height="' + str(H) + '" fill="url(#fd)"/>')
    out.append('<line x1="0" y1="' + str(y + bh / 2) + '" x2="' + str(W) + '" y2="' + str(y + bh / 2) + '" stroke="var(--sub)" stroke-width="1.5" stroke-dasharray="2 7"/>')
    for i, (name, agent, inp, outp, guard, human, hnote) in enumerate(FLOW_STAGES):
        x = i * (bw + gap)
        out.append('<g class="node" data-i="' + str(i) + '" tabindex="0"><rect x="' + str(x) + '" y="' + str(y) + '" width="' + str(bw) + '" height="' + str(bh) + '" rx="12" fill="var(--panel)" stroke="var(--line)"/>'
                   '<text x="' + str(x + 18) + '" y="' + str(y + 30) + '" font-family="IBM Plex Mono, monospace" font-size="11" letter-spacing="1.5" fill="var(--acc)">0' + str(i + 1) + '</text>'
                   '<text x="' + str(x + 18) + '" y="' + str(y + 62) + '" font-family="Space Grotesk, sans-serif" font-size="22" font-weight="600" letter-spacing="-.5" fill="var(--text)">' + name + '</text>'
                   '<text x="' + str(x + 18) + '" y="' + str(y + 88) + '" font-family="IBM Plex Mono, monospace" font-size="10.5" letter-spacing="1" fill="var(--dim)">' + agent.upper() + '</text></g>')
        if human:
            cx = x + bw / 2
            out.append('<g class="gate"><rect x="' + str(cx - 7) + '" y="' + str(y + bh + 26) + '" width="14" height="14" rx="3" fill="var(--acc)"/><line x1="' + str(cx) + '" y1="' + str(y + bh) + '" x2="' + str(cx) + '" y2="' + str(y + bh + 26) + '" stroke="var(--acc)" stroke-width="1.5"/>'
                       '<text x="' + str(cx) + '" y="' + str(y + bh + 62) + '" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="10.5" letter-spacing="1.5" fill="var(--text)">A PERSON SIGNS</text></g>')
        if i < n - 1:
            ax = x + bw + gap / 2
            out.append('<path d="M' + str(ax - 5) + ' ' + str(y + bh / 2 - 5) + ' L' + str(ax) + ' ' + str(y + bh / 2) + ' L' + str(ax - 5) + ' ' + str(y + bh / 2 + 5) + '" fill="none" stroke="var(--sub)" stroke-width="1.5"/>')
    out.append('<text x="0" y="' + str(y - 36) + '" font-family="IBM Plex Mono, monospace" font-size="10.5" letter-spacing="1.5" fill="var(--dim)">BRIEF IN</text><text x="' + str(W) + '" y="' + str(y - 36) + '" text-anchor="end" font-family="IBM Plex Mono, monospace" font-size="10.5" letter-spacing="1.5" fill="var(--dim)">PULL REQUEST OUT &#183; DOCS UPDATED</text>')
    out.append('</svg>')
    return ''.join(out)

def flow():
    TONE["t"] = "d"
    facts = [("6", "stages, each an agent with a defined input, output and guardrail"), ("3", "points where a person signs: the plan, the pull request, any escalation"), ("0", "merges to main by an agent"), ("1", "pipeline for every Hopsig build, and the one we install on yours")]
    hero_h = _hero_btns(page_hero("Agentic flow &#183; how a story becomes a pull request", "Six agents. One pipeline.<br>A person at every gate.", "This is the delivery pipeline every Hopsig build runs on. Each stage is an agent with a defined input, output and guardrail; each handoff can be stopped by a person. Hover a stage; the detail is below.", [("Book a consult", BOOK), ("See our work", WORK)]), _facts_row(facts))
    TONE["t"] = "l"
    rows = ''.join('<div class="frow rv" data-i="' + str(i) + '" style="transition-delay: ' + str(i * 60) + 'ms;"><span class="n">0' + str(i + 1) + '</span><div><div class="t">' + name + '</div><div class="a">' + agent + '</div></div><div><span class="k">In</span>' + inp + '</div><div><span class="k">Out</span>' + outp + '</div><div><span class="k">Guardrail</span>' + guard + '</div><div>' + (('<span class="k" style="color: ' + LIME + ';">A person signs</span>' + hnote) if human else '<span class="k">No gate</span>Runs on its own inside the guardrail') + '</div></div>' for i, (name, agent, inp, outp, guard, human, hnote) in enumerate(FLOW_STAGES))
    light = ('<div class="wrap" style="padding: 100px 0 120px;"><div class="rv" style="display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 28px;">' + h2("The flow.", 44) + lab("Agents outlined &#183; a person in Lime") + '</div><div class="rv">' + _flow_svg() + '</div>'
             '<div class="rv" style="margin-top: 60px; display: grid; grid-template-columns: 44px 170px 1fr 1fr 1fr 1fr; gap: 18px; padding: 0 0 12px; border-bottom: 1px solid ' + LINE + '; font-family: ' + MONO + '; font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: ' + DIM + ';"><span></span><span>Stage</span><span>In</span><span>Out</span><span>Guardrail</span><span>Who decides</span></div><div class="flist">' + rows + '</div></div>')
    TONE["t"] = "d"
    can = ["Plan from a plain-language brief, and show the plan before anything is built", "Populate epics and stories with acceptance criteria, in your tracker", "Implement a story inside your conventions, lint rules and branch policy", "Generate tests for the change and run them in your CI", "Review a diff and write the pull-request description", "Update the documentation that the change made stale", "Stop and ask a person, with the context, when a decision is outside the guardrails"]
    cannot = ["Merge to main", "Change the guardrails, the CI or the branch rules", "Touch a production environment or production data", "Decide scope, or add to it", "Sign off an increment", "Spend money, open accounts or talk to your users", "Carry on when a person has said stop"]
    dark = ('<div class="wrap"><section style="padding: 100px 0 0; display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: start;"><div class="rv"><div style="display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 20px;">' + h2("What the agents do.", 36) + '</div><div class="list">' + ''.join('<div><i></i><span>' + x + '</span></div>' for x in can) + '</div></div>'
            '<div class="rv" style="transition-delay: 90ms;"><div style="display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 20px;">' + h2("What they never do.", 36) + lab("Written into the guardrails", LIME) + '</div><div class="list nolime">' + ''.join('<div><i></i><span>' + x + '</span></div>' for x in cannot) + '</div></div></section>'
            '<section style="padding: 100px 0 120px; display: grid; grid-template-columns: 1fr 1.3fr; gap: 72px; align-items: start;"><div class="rv" style="display: flex; flex-direction: column; gap: 16px;">' + lab("Tooling", LIME) + h2("Built on Claude Code. Runs on yours.", 40) + '<p style="margin: 0; font-size: 16px; line-height: 27px; color: ' + SUB + ';">The agents run on Claude Code with MCP servers for your tracker, your CI and your docs. Model calls go through a provider with no training on your data, or inside your own cloud account; the SOW says which. Nothing of ours to adopt.</p><div style="display: flex; flex-wrap: wrap; gap: 6px; margin-top: 4px;">' + ''.join('<span style="font-family: ' + MONO + '; font-size: 11px; letter-spacing: 0.06em; color: ' + SUB + '; border: 1px solid ' + LINE + '; border-radius: 6px; padding: 6px 9px;">' + c + '</span>' for c in ["Claude Code", "MCP servers", "Your CI", "Your Jira or ours", "GitHub / GitLab", "Slack or mobile for escalations", "LangSmith / Langfuse for evals"]) + '</div></div>'
            '<div class="rv" style="transition-delay: 90ms; display: flex; flex-direction: column; gap: 18px;"><div style="border: 1px solid ' + LINE + '; background: ' + PANEL + '; border-radius: 12px; padding: 26px 28px; display: flex; flex-direction: column; gap: 10px;">' + lab("Where it has run") + '<div style="font-size: 20px; font-weight: 600; letter-spacing: -0.025em;">A ten-engineer practice, now its default path for new work.</div><div style="font-size: 15px; line-height: 24px; color: ' + DIM + ';">Two Android apps scoped at five developers were shipped by one, on the original timeline. The same pipeline customised a Dynamics 365 environment end to end through three MCP servers.</div><div style="display: flex; gap: 24px; margin-top: 6px;"><a href="SITE_Agentic.dc.html" class="more" style="text-decoration: none; font-family: ' + MONO + '; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: ' + LIME + ';">Install it on one repo in six weeks &#8594;</a><a href="' + WORK + '" class="more" style="text-decoration: none; font-family: ' + MONO + '; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: ' + LIME + ';">The case notes &#8594;</a></div></div></div></section></div>')
    TONE["t"] = "l"; close_h = closing("Agentic flow &#183; the call", "See it run on one of your stories.")
    html = wrap(surface("d", hero_h, seam=False) + surface("l", light) + surface("d", dark) + surface("l", close_h), "Flow")
    return html.replace('<title>Hopsig — Flow</title>', '<title>Hopsig — Agentic flow</title>')

# ------------------------------------------------------------------ CORE SERVICES (Home, section 2)
SERVICES = [
    ("Custom software", "Products built end to end", "A written scope, a fixed first increment, working software in your cloud inside six weeks. Then we keep going, or we hand it over with a runbook.",
     [("Scope in 3 days", "Two pages: in, out, cost."), ("Six-week increments", "Fixed scope, working software."), ("Handover pack", "Runbook, tests, walkthrough.")],
     [".NET / .NET Core", "Node.js", "Fastify", "Python", "FastAPI", "Django REST", "React", "Next.js", "Angular", "TypeScript", "PostgreSQL", "SQL Server", "MongoDB", "Redis", "GraphQL"], "Built &#183; fixed scope per increment", "SITE_S1_Custom.dc.html"),
    ("Team augmentation", "Senior engineers inside your team", "Named engineers in your standup from day one, on your repo and your board. We manage the person; you direct the work. Replacement inside ten working days if it is not working.",
     [("Senior only", "Years in production. No junior tier."), ("Your tooling", "Nothing of ours to adopt."), ("4 h overlap", "With GMT, every day.")],
     ["Backend", "Frontend", "Full-stack", "Mobile", "Data", "Product", ".NET", "Node.js", "Python", "React", "Angular", "Kotlin"], "Embedded &#183; monthly, per engineer", "SITE_S2_Team.dc.html"),
    ("Data engineering &amp; analytics", "Pipelines and reporting people stop arguing with", "Ingest, warehouse, models and dashboards that the in-house team can run after we leave. Measured before and after every increment.",
     [("Batch &#8594; incremental", "Nightly runs that finish."), ("One source of truth", "Warehouse and semantic layer."), ("Dashboards used", "By the people who asked.")],
     ["Custom ETL", "AWS Glue", "Athena", "PostgreSQL", "TimescaleDB", "Redshift", "Power BI", "Mixpanel", "Amplitude", "Funnel analysis"], "Data &amp; AI &#183; project or retained", "SITE_S3_Data.dc.html"),
    ("AI &amp; machine learning", "Features that have to be right, not impressive", "Retrieval, LLM features, classification and forecasting, each with an evaluation harness so you know when it got better and when it did not.",
     [("Eval harness first", "A number before a demo."), ("Retrieval done properly", "Chunking, ranking, citations."), ("Cost and latency", "Budgeted, then measured.")],
     ["Claude Code", "MCP servers", "LangGraph", "LangChain", "CrewAI", "RAG", "pgvector", "Qdrant", "Claude API", "OpenAI", "Gemini", "AWS Bedrock", "LangSmith", "Langfuse", "Promptfoo", "TensorFlow", "OpenCV"], "Data &amp; AI &#183; project or retained", "SITE_S4_AI.dc.html"),
    ("Cloud &amp; DevOps", "Deploys that are boring", "CI/CD, infrastructure as code, observability and cost control, set up so your team owns it afterwards and the on-call runbook is already written.",
     [("CI from day one", "Tests before features."), ("Infra as code", "Reviewed like code."), ("Cost control", "A bill you can explain.")],
     ["AWS EKS", "ECR", "RDS", "Lambda", "SQS / SNS", "S3", "CloudWatch", "Azure", "Docker", "CI/CD", "Vercel", "Railway", "Neon", "Cloudflare R2", "EMQX / MQTT"], "Embedded or Built", "SITE_S5_Cloud.dc.html"),
    ("Legacy modernisation", "Rebuilds the in-house team can run", "Strangler-pattern migrations off the system nobody wants to touch, one bounded piece at a time, with the old and new running side by side until the numbers match.",
     [("One seam at a time", "No big-bang cutover."), ("Parity measured", "Old vs new, same inputs."), ("Knowledge captured", "Docs where your team looks.")],
     ["Monolith &#8594; microservices", ".NET Framework &#8594; .NET", "IIS / EC2 stabilisation", "RDS migrations", "Cron &#8594; queues", "gRPC", "GraphQL", "WordPress &#8594; custom"], "Built &#183; fixed scope per increment", "SITE_S6_Legacy.dc.html"),
    ("Mobile", "iOS and Android without two teams", "Cross-platform where it makes sense, native where it does not, with the release pipeline and crash reporting set up before the first store submission.",
     [("One codebase", "Where the product allows."), ("Store-ready", "Signing, review, release."), ("Crash-free", "Tracked from day one.")],
     ["Android", "Kotlin", "AOSP", "iOS", "Offline-first sync", "EMQX / MQTT", "Tauri", "Electron", "Figma design system"], "Built &#183; fixed scope per increment", "SITE_S7_Mobile.dc.html"),
    ("QA &amp; test automation", "Suites that make deploys boring", "Unit, integration and end-to-end coverage that runs in CI in minutes, plus load testing before the launch rather than after the outage.",
     [("Runs in minutes", "Or it is not run."), ("Flake tracked", "And fixed, not retried."), ("Load tested", "Before launch day.")],
     ["Automated test generation", "Eval harnesses", "Guardrails", "Playwright", "pytest", "Jest", "k6", "CI pipelines"], "Embedded &#183; monthly, per engineer", "SITE_S8_QA.dc.html"),
]

GOOD = {
    0: ["A new product or module with a deadline", "A rebuild the in-house team cannot fit in", "An MVP that has to survive its first customers"],
    1: ["Scaling a team without a six-month hiring round", "A nine-month push with a hard date", "Covering a leaver while you hire properly"],
    2: ["Reporting nobody trusts", "A nightly batch that is now a daily problem", "Numbers that differ by who ran the query"],
    3: ["An AI feature that has to be right, not impressive", "Search or support that should answer from your data", "Forecasts the finance team will actually use"],
    4: ["Deploys that need a war room", "A cloud bill nobody can explain", "No runbook for the thing that pages you"],
    5: ["A system nobody wants to touch", "A framework three major versions behind", "A migration that has been &#8216;next quarter&#8217; for two years"],
    6: ["A web product that needs to be in the stores", "An app with more crashes than reviews", "Two native teams doing the same work twice"],
    7: ["Releases that break something every time", "A test suite everyone skips", "A launch with no idea what load it takes"],
}
def core_services():
    cards = ''
    for i, (name, tag, desc, gets, chips, shape, href) in enumerate(SERVICES):
        cards += ('<article class="sheet"><div class="veil" aria-hidden="true"></div>'
                  '<div class="tab" role="button" tabindex="0" aria-label="Open ' + name + '"><span class="n">' + str(i + 1).zfill(2) + '</span><span class="t">' + name + '</span><span class="s">' + shape + '</span><a class="m" href="' + href + '">Details &#8594;</a></div>'
                  '<div class="sh"><div class="big" aria-hidden="true">' + str(i + 1).zfill(2) + '</div>'
                  '<div><h3>' + tag + '</h3><p>' + desc + '</p><div class="get">' + ''.join('<div><b>' + a + '</b>' + b + '</div>' for a, b in gets) + '</div></div>'
                  '<div class="right"><div>' + lab("Good for") + '<div class="good" style="margin-top: 8px;">' + ''.join('<div>&#8212; ' + g + '</div>' for g in GOOD[i]) + '</div></div>'
                  '<div>' + lab("Stack &#183; only what we have shipped to production") + '<div class="chips" style="margin-top: 10px;">' + ''.join('<span class="chip">' + c + '</span>' for c in chips) + '</div></div>'
                  '<div class="fee"><span>Engagement: <b>' + shape + '</b></span><span>From <b>[YOUR RATE]</b> / day</span></div></div></div></article>')
    return ('<section id="svc" class="wrap" style="padding: 120px 0 0;"><div class="rv" style="display: flex; align-items: flex-end; justify-content: space-between; gap: 40px; margin-bottom: 28px;"><div style="display: flex; flex-direction: column; gap: 14px;">' + lab("Core services", LIME) + h2("Eight things we do. All of them end in something running.", 48, TEXT, "820px") + '</div>'
            '<div style="display: flex; flex-direction: column; align-items: flex-end; gap: 10px;"><a class="more" href="SITE_Services.dc.html" style="text-decoration: none; font-family: ' + MONO + '; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: ' + LIME + '; white-space: nowrap;">All services &#8594;</a><span style="font-family: ' + MONO + '; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: ' + DIM + ';">Scroll &#8212; the sheets stack, the tabs stay</span></div></div>'
            '<div id="file" class="file"><div class="legend" aria-hidden="true">' + '<i class="on"></i>' + '<i></i>' * 7 + '</div>' + cards + '<div class="sheet end"><div class="endc"><span>08 of 08 &#183; the file closes here</span><span style="display: flex; gap: 28px;"><a href="SITE_Services.dc.html">All services &#8594;</a><a href="SITE_Rates.dc.html">Rates &#8594;</a></span></div></div><div class="dwell" aria-hidden="true"></div></div></section>')

def accordion_real():
    left = ''.join('<div class="item' + (' on' if i == 0 else '') + '"><div class="t"><span>' + a + '</span><span class="pl">' + ('&#8722;' if i == 0 else '+') + '</span></div><div class="b">' + b + '</div></div>' for i, (a, b, ci) in enumerate(DOMAINS))
    right = ''
    for i, (a, b, ci) in enumerate(DOMAINS):
        dom, title, prob, did, meas, stack, shape = (RECORD if ci[0] == 'F' else CASES)[ci[1]]
        right += ('<div class="pv' + (' on' if i == 0 else '') + '">' + lab("0" + str(i + 1) + " &#183; " + a, LIME) + '<div style="font-size: 24px; font-weight: 600; letter-spacing: -0.03em; line-height: 1.2;">' + title + '</div>'
                  '<div style="font-size: 14px; line-height: 23px; color: ' + SUB + ';"><span style="color: ' + DIM + ';">Measured &#8212; </span>' + meas + '</div>'
                  '<div style="display: flex; flex-wrap: wrap; gap: 6px;">' + ''.join('<span style="font-family: ' + MONO + '; font-size: 11px; letter-spacing: 0.06em; color: ' + SUB + '; border: 1px solid ' + LINE + '; border-radius: 6px; padding: 6px 9px;">' + c + '</span>' for c in stack) + '</div>'
                  '<div style="margin-top: auto; font-family: ' + MONO + '; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: ' + DIM + ';">Client withheld &#183; <a href="' + WORK + '" style="color: ' + LIME + '; text-decoration: none;">Full case note &#8594;</a></div></div>')
    return ('<section id="acc" class="wrap" style="padding-top: 140px; padding-bottom: 140px;"><style>.phx{color:var(--acc);font-family:' + MONO + ';font-size:12px}</style><div class="rv" style="display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 44px;">' + h2("Where we have done this before.", 44) + '<a href="' + WORK + '" class="more" style="text-decoration: none; font-family: ' + MONO + '; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: ' + LIME + ';">See our work &#8594;</a></div>'
            '<div class="acc"><div>' + left + '<div style="border-top: 1px solid ' + LINE + ';"></div></div><div class="prev">' + right + '</div></div></section>')

# ------------------------------------------------------------------ BOOK
def book():
    TONE["t"] = "d"
    steps = [("01", "We listen", "Tell us the problem the way you would tell a colleague. No deck needed."), ("02", "We say yes or no", "On the call. If it is outside what we do well, we say which of our contacts to call."), ("03", "You get a scope", "If yes, a two-page SOW three days later: in, out, cost. Before you pay anything.")]
    html = ('<section class="ph"><canvas id="heroCanvas" aria-hidden="true" data-drift="1"></canvas><div class="wrap c book"><div style="display: flex; flex-direction: column; gap: 24px;">' + lab("Book a call", LIME) +
            '<h1 style="margin: 0; font-size: 64px; font-weight: 600; line-height: 1.02; letter-spacing: -0.05em;">Thirty minutes.<br>Bring the problem,<br>not a brief.</h1>'
            '<p style="margin: 0; max-width: 520px; font-size: 19px; line-height: 31px; color: ' + SUB + ';">The people who would do the work are on the call, not a salesperson. You will leave knowing whether we can help, and roughly what it would cost.</p>'
            '<div style="display: flex; flex-direction: column; gap: 0; margin-top: 12px; max-width: 520px;">' + ''.join('<div class="rv" style="display: grid; grid-template-columns: 40px 1fr; gap: 14px; padding: 18px 0; border-top: 1px solid ' + LINE + ';"><div style="font-family: ' + MONO + '; font-size: 12px; color: ' + LIME + ';">' + n + '</div><div><div style="font-size: 19px; font-weight: 600; letter-spacing: -0.02em;">' + t + '</div><div style="font-size: 15px; line-height: 24px; color: ' + DIM + '; margin-top: 4px;">' + s + '</div></div></div>' for n, t, s in steps) + '</div>'
            '<div style="font-family: ' + MONO + '; font-size: 12px; color: ' + DIM + '; line-height: 1.8;">Prefer writing? <a href="SITE_Brief.dc.html" class="more" style="color: ' + LIME + '; text-decoration: none; padding: 4px 0;">Send a brief &#8594;</a> &#8212; or email [HELLO@HOPSIG.COM]; reply within one working day.<br>Build note: replace this card with the Cal.com / Calendly embed; keep the layout.</div></div>'
            '<div id="cal" class="cal"><div class="live" style="display: flex; flex-direction: column; gap: 18px;"><div style="display: flex; justify-content: space-between; align-items: baseline;">' + lab("Next week &#183; 30 minutes") + lab("GMT", LIME) + '</div><div id="days" class="days"></div><div id="slots" class="slots"></div>'
            '<div id="sum" style="font-family: ' + MONO + '; font-size: 12px; color: ' + SUB + '; border-top: 1px solid ' + LINE + '; padding-top: 14px;">Pick a day and a time (GMT).</div>'
            '<div class="f"><input id="fName" placeholder="Your name"><input id="fEmail" placeholder="Work email"><input id="fCo" placeholder="Company &#183; team size"><textarea id="fWhat" placeholder="The problem, in a sentence or two"></textarea></div>'
            '<button id="confirmBtn" class="btnp">Confirm the call</button></div>'
            '<div class="confirm">' + lab("Booked", LIME) + '<div style="font-size: 26px; font-weight: 600; letter-spacing: -0.03em; line-height: 1.2;">See you then.</div><div id="cWhen" style="font-family: ' + MONO + '; font-size: 13px; color: ' + TEXT + ';"></div><div style="font-family: ' + MONO + '; font-size: 12px; line-height: 1.8; color: ' + DIM + ';">Invite sent to <span id="cMail" style="color: ' + TEXT + ';"></span>.<br>The people who would do the work will be on it. If anything changes, reply to the invite.</div><div class="list" style="margin-top: 6px;"><div><i></i><span>Bring the problem, not a brief</span></div><div><i></i><span>Someone who can say yes to a scope</span></div><div><i></i><span>Access to nothing &#8212; we will ask after</span></div></div></div></div></div></section>')
    hero_h = html; TONE["t"] = "l"
    strip = ('<section class="wrap" style="padding: 120px 0 140px;"><div class="rv" style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid ' + LINE + '; border-bottom: 1px solid ' + LINE + '; padding: 22px 0; font-family: ' + MONO + '; font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase; color: ' + DIM + ';">' + ''.join('<span>' + s + '</span>' for s in ["No salespeople", "Engineers on the call", "Scope in 3 days", "Nothing to pay before the scope", "Lahore &#183; GMT+5"]) + '</div></section>')
    return wrap(surface("d", hero_h, seam=False) + surface("l", strip), "Book")

if __name__ == "__main__":
    jobs = [("SITE_Home.dc.html", home), ("SITE_Services.dc.html", services), ("SITE_Work.dc.html", work), ("SITE_Approach.dc.html", approach), ("SITE_Rates.dc.html", rates), ("SITE_Book.dc.html", book)]
    jobs += [(name, (lambda i=i: service_page(i))) for i, name in enumerate(SVC_FILES)]
    jobs += [("SITE_Industries.dc.html", industries)] + [(name, (lambda i=i: industry_page(i))) for i, name in enumerate(IND_FILES)]
    jobs += [("SITE_Notes.dc.html", notes_index), ("SITE_Note_Agents.dc.html", note_page), ("SITE_Note_SOW.dc.html", lambda: note_page(1)), ("SITE_Agentic.dc.html", agentic), ("SITE_Flow.dc.html", flow), ("SITE_Agencies.dc.html", agencies), ("SITE_Join.dc.html", join), ("SITE_Working.dc.html", working), ("SITE_Brief.dc.html", brief), ("SITE_Compare.dc.html", compare), ("SITE_Privacy.dc.html", privacy), ("SITE_Terms.dc.html", terms), ("SITE_404.dc.html", notfound)]
    jobs += [(name, (lambda k=key, j=idx, n=name: case_page(k, j, n))) for key, idx, name in CASE_PAGES]
    for name, fn in jobs:
        TONE["file"] = name
        s = fn(); open(OUTDIR + name, 'w').write(s); print(name, len(s))
