// Copyright (C) 2018 - Matthew Cornelisse
// src: https://github.com/mctrivia/DigiQR
(function() {(function(E,K){function F(){for(var a=E.getElementsByClassName("DigiQR"),b=0;b<a.length;b++){var c=a[b].getAttribute("uri");if(!c){c=a[b].getAttribute("address");if(!c)continue;var d=parseFloat(a[b].getAttribute("amount")),c="digibyte:"+c;!isNaN(d)&&d&&(c+="?amount="+d.toFixed(8))}var d=parseInt(a[b].getAttribute("size")||300),l=parseInt(a[b].getAttribute("logo")||6),m=parseFloat(a[b].getAttribute("r")||.5),p="digiid://"==c.toLowerCase().substr(0,9)?1:0;a[b].src=w(c,d,l,m,p);a[b].style.cursor="pointer";
(function(d){a[b].addEventListener("click",function(){window.open(d,"_blank")})})(c)}}function w(a,b,c,d,l){var m=a.indexOf(":")+1;"dgb1"==a.substr(m,4)&&-1==a.indexOf("?")&&(a=a.toUpperCase());return G({data:a,size:b,logo:c,r:d,symbol:l})}function L(a){var b=B.J(a);return{g:function(){return 4},b:function(){return b.length},write:function(a){for(var d=0;d<b.length;d+=1)a.put(b[d],8)}}}function M(a){function b(a){if("0"<=a&&"9">=a)return a.charCodeAt(0)-48;if("A"<=a&&"Z">=a)return a.charCodeAt(0)-
65+10;switch(a){case " ":return 36;case "$":return 37;case "%":return 38;case "*":return 39;case "+":return 40;case "-":return 41;case ".":return 42;case "/":return 43;case ":":return 44;default:throw"illegal char :"+a;}}return{g:function(){return 2},b:function(){return a.length},write:function(c){for(var d=0;d+1<a.length;)c.put(45*b(a.charAt(d))+b(a.charAt(d+1)),11),d+=2;d<a.length&&c.put(b(a.charAt(d)),6)}}}function H(){var a=[],b=0,c={B:function(){return a},put:function(a,b){for(var d=0;d<b;d+=
1)c.s(1==(a>>>b-d-1&1))},c:function(){return b},s:function(d){var l=Math.floor(b/8);a.length<=l&&a.push(0);d&&(a[l]|=128>>>b%8);b+=1}};return c}function B(a,b){function c(a,b){for(var d=-1;7>=d;d+=1)if(!(-1>=a+d||e<=a+d))for(var l=-1;7>=l;l+=1)-1>=b+l||e<=b+l||(p[a+d][b+l]=0<=d&&6>=d&&(0==l||6==l)||0<=l&&6>=l&&(0==d||6==d)||2<=d&&4>=d&&2<=l&&4>=l?!0:!1)}function d(a,d){for(var b=e=4*l+17,k=Array(b),f=0;f<b;f+=1){k[f]=Array(b);for(var h=0;h<b;h+=1)k[f][h]=null}p=k;c(0,0);c(e-7,0);c(0,e-7);b=z.G(l);
for(k=0;k<b.length;k+=1)for(f=0;f<b.length;f+=1){var h=b[k],t=b[f];if(null==p[h][t])for(var v=-2;2>=v;v+=1)for(var q=-2;2>=q;q+=1)p[h+v][t+q]=-2==v||2==v||-2==q||2==q||0==v&&0==q?!0:!1}for(b=8;b<e-8;b+=1)null==p[b][6]&&(p[b][6]=0==b%2);for(b=8;b<e-8;b+=1)null==p[6][b]&&(p[6][b]=0==b%2);b=z.w(m<<3|d);for(k=0;15>k;k+=1)f=!a&&1==(b>>k&1),6>k?p[k][8]=f:8>k?p[k+1][8]=f:p[e-15+k][8]=f;for(k=0;15>k;k+=1)f=!a&&1==(b>>k&1),8>k?p[8][e-k-1]=f:9>k?p[8][15-k-1+1]=f:p[8][15-k-1]=f;p[e-8][8]=!a;if(7<=l){b=z.A(l);
for(k=0;18>k;k+=1)f=!a&&1==(b>>k&1),p[Math.floor(k/3)][k%3+e-8-3]=f;for(k=0;18>k;k+=1)f=!a&&1==(b>>k&1),p[k%3+e-8-3][Math.floor(k/3)]=f}if(null==g){h=l;b=I.m(h,m);k=H();for(f=0;f<y.length;f+=1)t=y[f],k.put(t.g(),4),k.put(t.b(),z.c(t.g(),h)),t.write(k);for(f=h=0;f<b.length;f+=1)h+=b[f].i;if(k.c()>8*h)throw"code length overflow. ("+k.c()+">"+8*h+")";for(k.c()+4<=8*h&&k.put(0,4);0!=k.c()%8;)k.s(!1);for(;!(k.c()>=8*h);){k.put(236,8);if(k.c()>=8*h)break;k.put(17,8)}for(var n=0,h=f=0,t=Array(b.length),
v=Array(b.length),q=0;q<b.length;q+=1){var u=b[q].i,x=b[q].u-u,f=Math.max(f,u),h=Math.max(h,x);t[q]=Array(u);for(var r=0;r<t[q].length;r+=1)t[q][r]=255&k.B()[r+n];n+=u;r=z.C(x);u=C(t[q],r.b()-1).o(r);v[q]=Array(r.b()-1);for(r=0;r<v[q].length;r+=1)x=r+u.b()-v[q].length,v[q][r]=0<=x?u.f(x):0}for(r=k=0;r<b.length;r+=1)k+=b[r].u;k=Array(k);for(r=n=0;r<f;r+=1)for(q=0;q<b.length;q+=1)r<t[q].length&&(k[n]=t[q][r],n+=1);for(r=0;r<h;r+=1)for(q=0;q<b.length;q+=1)r<v[q].length&&(k[n]=v[q][r],n+=1);g=k}b=g;k=
-1;f=e-1;h=7;t=0;v=z.F(d);for(q=e-1;0<q;q-=2)for(6==q&&--q;;){for(r=0;2>r;r+=1)null==p[f][q-r]&&(n=!1,t<b.length&&(n=1==(b[t]>>>h&1)),v(f,q-r)&&(n=!n),p[f][q-r]=n,--h,-1==h&&(t+=1,h=7));f+=k;if(0>f||e<=f){f-=k;k=-k;break}}}var l=a,m=D[b],p=null,e=0,g=null,y=[],h={v:function(a,b){b=b||"Byte";var d;switch(b){case "Numeric":case "Alphanumeric":d=M(a);break;case "Byte":d=L(a);break;default:throw"mode:"+b;}y.push(d);g=null}};h.addData=h.v;h.a=function(a,b){if(0>a||e<=a||0>b||e<=b)throw a+","+b;return p[a][b]};
h.isDark=h.a;h.l=function(){return e};h.getModuleCount=h.l;h.I=function(){if(1>l){for(var a=1;40>a;a++){for(var b=I.m(a,m),g=H(),c=0;c<y.length;c++){var e=y[c];g.put(e.g(),4);g.put(e.b(),z.c(e.g(),a));e.write(g)}for(c=e=0;c<b.length;c++)e+=b[c].i;if(g.c()<=8*e)break}l=a}for(g=b=a=0;8>g;g+=1)if(d(!0,g),c=z.D(h),0==g||a>c)a=c,b=g;d(!1,b)};h.make=h.I;return h}function C(a,b){if("undefined"==typeof a.length)throw a.length+"/"+b;var c=function(){for(var d=0;d<a.length&&0==a[d];)d+=1;for(var c=Array(a.length-
d+b),p=0;p<a.length-d;p+=1)c[p]=a[p+d];return c}(),d={f:function(a){return c[a]},b:function(){return c.length},multiply:function(a){for(var b=Array(d.b()+a.b()-1),c=0;c<d.b();c+=1)for(var l=0;l<a.b();l+=1)b[c+l]^=A.j(A.h(d.f(c))+A.h(a.f(l)));return C(b,0)},o:function(a){if(0>d.b()-a.b())return d;for(var b=A.h(d.f(0))-A.h(a.f(0)),c=Array(d.b()),l=0;l<d.b();l+=1)c[l]=d.f(l);for(l=0;l<a.b();l+=1)c[l]^=A.j(A.h(a.f(l))+b);return C(c,0).o(a)}};return d}function N(a,b,t){var d=.5*a,l=d*b;b=d-l;for(var m=
d+l,p=[],e=0;16>e;e++){var g=function(a,b,d,g,e,m,h,p,t,y,x,r,w,z,A,B){f[u]();f.moveTo(a,b);f[c](d,g);f[c](e,m);f[c](h,p);f.arc(t,y,l,x*Math.PI,r*Math.PI);f[c](w,z);f[c](A,B);f[c](a,b);f[n]();f.fill()},y=function(a,b,d,g,e,m,h,p,t,y,x,r){f[u]();f.moveTo(a,b);f[c](d,g);f[c](e,m);f.arc(h,p,l,t*Math.PI,y*Math.PI);f[c](x,r);f[c](a,b);f[n]();f.fill()},h=E.createElement("canvas");h.height=h.width=a;var f=h.getContext("2d");f.fillStyle=t;1!=e&&9!=e||y(a,a,d,a,d,m,m,m,1,1.5,a,d);8!=e&&9!=e||y(0,0,d,0,d,b,
b,b,0,.5,0,d);4!=e&&6!=e||y(a,0,a,d,m,d,m,b,.5,1,d,0);2!=e&&6!=e||y(0,a,0,d,b,d,b,m,1.5,0,d,a);3==e&&f.fillRect(0,d,a,d);12==e&&f.fillRect(0,0,a,d);10==e&&f.fillRect(0,0,d,a);5==e&&f.fillRect(d,0,d,a);15==e&&f.fillRect(0,0,a,a);7==e&&g(a,a,a,0,d,0,d,b,b,b,0,.5,0,d,0,a);11==e&&g(0,a,a,a,a,d,m,d,m,b,.5,1,d,0,0,0);13==e&&g(a,0,0,0,0,d,b,d,b,m,1.5,0,d,a,a,a);14==e&&g(0,0,0,a,d,a,d,m,m,m,1,1.5,a,d,a,0);p[e]=h}return p}function J(a,b){2>b&&(a[u](),a.fillStyle="#0066cc",a.arc(0,0,.891,0,2*Math.PI),a[n](),
a.fill(),a[u](),a.fillStyle="#002352",a.arc(0,0,.709,0,2*Math.PI),a[n](),a.fill())}function O(a,y){function t(){function d(a,b){var d=E.createElement("canvas");d.width=1263;d.height=689;d=d.getContext("2d");d.fillStyle=b;d.save();d.strokeStyle="rgba(0,0,0,0)";d.miterLimit=4;d[u]();d.moveTo(0,0);d[c](1263,0);d[c](1263,689);d[c](0,689);d[n]();d.clip();d.save();switch(a){case 1:d.translate(3.33,-5.24);d.rotate(.0113);break;case 2:d.transform(-1,-.05,-.05,1,1403.03,43.69);break;case 3:d.translate(-361.39,
43.69),d.rotate(-.0482)}d.save();d[u]();d.moveTo(-1E4,-1E4);d[c](2E4,-1E4);d.quadraticCurveTo(2E4,-1E4,2E4,-1E4);d[c](2E4,2E4);d.quadraticCurveTo(2E4,2E4,2E4,2E4);d[c](-1E4,2E4);d.quadraticCurveTo(-1E4,2E4,-1E4,2E4);d[c](-1E4,-1E4);d.quadraticCurveTo(-1E4,-1E4,-1E4,-1E4);d[n]();d.fill();d.stroke();d.restore();d.restore();d.restore();return d}a.translate(-.88,-.8);a.scale(.07,.07);a.save();a.strokeStyle="rgba(0,0,0,0)";a.miterLimit=4;a.scale(.465,.465);a.translate(.222,0);a.scale(.463,.463);a.save();
var m=a.createLinearGradient(165.69,271.09,165.69,205.77);m.addColorStop(0,"#dfddda");m.addColorStop(1,"#b7ced7");m=d(1,m);m=m.createPattern(m.canvas,"no-repeat");a.fillStyle=m;a.translate(-108.36,-202.39);a[u]();a.moveTo(167.06,202.39);a[c](166.84,202.79);a[b](165.84,216.38,144.22,257.92,144.22,257.92);a[c](143.67,257.92);a[c](156.14,267.58);a.translate(166.24,270.338);a.arc(0,0,10.47,-2.875,-1.592,0);a.translate(-166.24,-270.338);a.translate(165.627,270.233);a.arc(0,0,10.37,-1.533,-.32,0);a.translate(-165.627,
-270.233);a[c](188.2,258.42);a[c](188.42,258.01);a[b](188.42,258.01,167.79,216,167.06,202.39);a[n]();a.fill();a.stroke();a.restore();a.save();m=a.createLinearGradient(1184.86,332,1213.41,282.55);m.addColorStop(0,"#0098d5");m.addColorStop(1,"#164c8e");m=d(2,m);m=m.createPattern(m.canvas,"no-repeat");a.fillStyle=m;a.translate(-108.36,-202.39);a[u]();a.moveTo(223,308.18);a[c](222.61,308.18);a[b](217.61,305.62,206.78,302.68,196.1,301.12);a.translate(160.783,539.68);a.arc(0,0,241.16,-1.423,-1.537,1);a.translate(-160.783,
-539.68);a[c](169.59,280.41);a[b](165.01,268.47,169.59,280.41,171.37,276);a[b](173.03,271.86,174.25,277.36,171.75,274);a[c](189.15,261.44);a[c](189.55,261.44);a[b](189.55,261.44,213,301.05,223,308.18);a[n]();a.fill();a.stroke();a.restore();a.save();m=a.createLinearGradient(26442.139,14187.645,28023.673,11874.869);m.addColorStop(0,"#0098d5");m.addColorStop(1,"#164c8e");m=d(3,m);m=m.createPattern(m.canvas,"no-repeat");a.fillStyle=m;a.translate(-108.36,-202.39);a[u]();a.moveTo(108.36,308.18);a[c](108.75,
308.18);a[b](113.75,305.62,124.58,302.68,135.26,301.12);a.translate(170.837,539.641);a.arc(0,0,241.16,-1.719,-1.606,0);a.translate(-170.837,-539.641);a[c](161.78,280.38);a[b](166.36,268.44,161.78,280.38,160,275.97);a[b](158.34,271.83,157.12,277.33,159.62,273.97);a[c](142.22,261.41);a[c](141.82,261.41);a[b](141.82,261.41,118.33,301.05,108.36,308.18);a[n]();a.fill();a.stroke();a.restore();a.save();a.fillStyle="#fff";a.translate(-108.36,-202.39);a[u]();a.moveTo(178.91,271.58);a[b](178.91,278.88,173.27,
284.79,166.31,284.79);a[b](159.35,284.79,153.71,278.88,153.71,271.58);a[b](153.71,264.28,159.35,258.37,166.31,258.37);a[b](173.27,258.37,178.91,264.29,178.91,271.58);a[n]();a.fill();a.stroke();a.restore();a.save();a.fillStyle="#fff";a[u]();a.moveTo(33.86,59.01);a[c](35.32,55.53);a[c](46.33,64.07);a[c](45.47,67.39);a.fill();a.stroke();a.restore();a.save();a.fillStyle="#fff";a[u]();a.moveTo(81.18,58.99);a[c](80.07,55.63);a[c](69.18,63.2);a[c](70.3,66.58);a.fill();a.stroke();a.restore();a.save();a.fillStyle=
"#fff";a[u]();a.moveTo(52.96,80.53);a[c](61.14,80.53);a[c](60.63,96.28);a[c](54.02,96.28);a[c](52.96,80.53);a[c](52.96,80.53);a[n]();a.fill();a.stroke();a.restore();a.restore()}function d(){a.fillStyle="#FFFFFF";a[u]();a.moveTo(.245,-.361);a[c](.27,-.428);a[b](.273,-.435,.268,-.442,.261,-.442);a[c](.166,-.442);a[c](.136,-.363);a[c](.094,-.363);a[c](.118,-.428);a[b](.121,-.435,.116,-.442,.109,-.442);a[c](.014,-.442);a[c](-.016,-.363);a[c](-.313,-.363);a[b](-.327,-.363,-.339,-.356,-.346,-.344);a[c](-.42,
-.214);a[c](-.317,-.214);a[c](.134,-.214);a[b](.152,-.214,.17,-.211,.187,-.204);a[b](.221,-.19,.259,-.16,.249,-.091);a[b](.233,.024,.116,.228,-.139,.231);a[c](-.007,-.111);a[b](-.002,-.125,-.012,-.14,-.028,-.14);a[c](-.204,-.14);a[c](-.417,.383);a[b](-.417,.383,-.374,.388,-.307,.388);a[c](-.329,.443);a[c](-.231,.443);a[b](-.223,.443,-.216,.439,-.213,.431);a[c](-.195,.384);a[b](-.18,.383,-.166,.381,-.151,.379);a[c](-.175,.443);a[c](-.078,.443);a[b](-.07,.443,-.063,.439,-.061,.431);a[c](-.033,.359);
a[b](.127,.323,.298,.243,.4,.076);a[b](.606,-.26,.392,-.346,.245,-.361);a[n]();a.fill()}a.save();switch(y){case 0:d();break;case 1:a.miterLimit="0";a.save();a.save();a.globalAlpha="0.3";a.fillStyle="#FFFFFF";a[u]();a.moveTo(.163,.589);a[b](.161,.589,.158,.589,.156,.588);a[b](.066,.562,.008,.526,-.053,.461);a[b](-.132,.376,-.175,.264,-.175,.144);a[b](-.175,.045,-.098,-.035,-.001,-.035);a[b](.095,-.035,.172,.045,.172,.144);a[b](.172,.209,.225,.262,.289,.262);a[b](.353,.262,.406,.209,.406,.144);a[b](.406,
-.085,.223,-.271,-.002,-.271);a[b](-.162,-.271,-.308,-.174,-.374,-.026);a[b](-.395,.023,-.407,.08,-.407,.144);a[b](-.407,.192,-.403,.266,-.369,.363);a[b](-.364,.379,-.371,.396,-.386,.402);a[b](-.401,.408,-.417,.4,-.423,.384);a[b](-.45,.304,-.464,.226,-.464,.144);a[b](-.464,.072,-.45,.005,-.425,-.052);a[b](-.35,-.221,-.184,-.33,-.002,-.33);a[b](.254,-.33,.462,-.117,.462,.145);a[b](.462,.244,.384,.324,.289,.324);a[b](.193,.324,.115,.244,.115,.145);a[b](.115,.081,.062,.028,-.002,.028);a[b](-.066,.028,
-.119,.081,-.119,.145);a[b](-.119,.249,-.081,.346,-.014,.419);a[b](.04,.476,.091,.507,.171,.53);a[b](.186,.535,.194,.551,.191,.568);a[b](.187,.58,.176,.589,.163,.589);a[c](.163,.589);a[c](.163,.589);a[n]();a.moveTo(.277,.464);a[b](.21,.464,.151,.445,.102,.41);a[b](.018,.349,-.031,.249,-.031,.144);a[b](-.031,.127,-.018,.114,-.003,.114);a[b](.012,.114,.025,.128,.025,.144);a[b](.025,.229,.065,.31,.133,.36);a[b](.173,.389,.22,.404,.277,.404);a[b](.291,.404,.313,.402,.336,.398);a[b](.351,.395,.365,.406,
.368,.422);a[b](.371,.438,.361,.454,.346,.457);a[b](.312,.464,.285,.464,.277,.464);a[c](.277,.464);a[c](.277,.464);a[n]();a.moveTo(-.126,.577);a[b](-.134,.577,-.141,.574,-.147,.568);a[b](-.195,.514,-.222,.481,-.26,.408);a[b](-.299,.333,-.32,.242,-.32,.144);a[b](-.32,-.037,-.176,-.183,-.001,-.183);a[b](.174,-.183,.318,-.037,.318,.144);a[b](.318,.161,.305,.174,.29,.174);a[b](.275,.174,.262,.16,.262,.144);a[b](.262,-.003,.144,-.123,-.001,-.123);a[b](-.146,-.123,-.264,-.004,-.264,.144);a[b](-.264,.231,
-.246,.312,-.212,.377);a[b](-.176,.447,-.151,.478,-.108,.524);a[b](-.097,.536,-.097,.555,-.109,.567);a[b](-.112,.574,-.119,.577,-.126,.577);a[c](-.126,.577);a[c](-.126,.577);a[n]();a.moveTo(-.479,-.156);a[b](-.485,-.156,-.491,-.158,-.496,-.161);a[b](-.509,-.171,-.512,-.19,-.503,-.204);a[b](-.447,-.289,-.376,-.355,-.291,-.402);a[b](-.114,-.501,.112,-.502,.289,-.403);a[b](.374,-.356,.444,-.29,.501,-.206);a[b](.511,-.192,.508,-.173,.495,-.164);a[b](.482,-.155,.465,-.157,.456,-.171);a[b](.405,-.247,.341,
-.307,.264,-.349);a[b](.103,-.438,-.104,-.438,-.265,-.348);a[b](-.341,-.305,-.406,-.245,-.455,-.168);a[b](-.461,-.16,-.47,-.156,-.479,-.156);a[c](-.479,-.156);a[c](-.479,-.156);a[n]();a.moveTo(.327,-.474);a[b](.322,-.474,.318,-.475,.314,-.478);a[b](.206,-.538,.112,-.564,.001,-.564);a[b](-.111,-.564,-.217,-.535,-.313,-.478);a[b](-.327,-.47,-.343,-.475,-.351,-.49);a[b](-.358,-.506,-.353,-.523,-.339,-.532);a[b](-.235,-.594,-.119,-.625,.002,-.625);a[b](.121,-.625,.227,-.596,.341,-.532);a[b](.355,-.524,
.361,-.506,.354,-.491);a[b](.346,-.48,.337,-.474,.327,-.474);a[c](.327,-.474);a[c](.327,-.474);a[n]();a.fill();a.restore();a.save();a.fillStyle="#FFFFFF";a[u]();a.moveTo(-.34,-.532);a[b](-.354,-.523,-.359,-.506,-.352,-.49);a[b](-.344,-.475,-.328,-.47,-.314,-.478);a[b](-.217,-.535,-.112,-.564,-.001,-.564);a[c](-.001,-.625);a[b](-.121,-.625,-.236,-.593,-.34,-.532);a[n]();a.fill();a[u]();a.moveTo(-.29,-.402);a[b](-.375,-.355,-.446,-.289,-.502,-.204);a[b](-.511,-.19,-.508,-.172,-.495,-.162);a[b](-.49,
-.158,-.484,-.156,-.478,-.156);a[b](-.469,-.156,-.46,-.16,-.456,-.169);a[b](-.405,-.246,-.341,-.307,-.265,-.349);a[b](-.184,-.394,-.092,-.416,0,-.416);a[c](0,-.477);a[b](-.101,-.476,-.202,-.452,-.29,-.402);a[n]();a.fill();a[u]();a.moveTo(0,-.183);a[b](-.176,-.183,-.319,-.037,-.319,.144);a[b](-.319,.242,-.298,.332,-.259,.408);a[b](-.222,.481,-.195,.514,-.147,.567);a[b](-.141,.574,-.134,.577,-.126,.577);a[b](-.119,.577,-.112,.574,-.107,.567);a[b](-.095,.556,-.095,.537,-.106,.525);a[b](-.15,.477,-.174,
.448,-.21,.378);a[b](-.245,.312,-.263,.231,-.263,.144);a[b](-.263,-.003,-.145,-.123,0,-.123);a[c](0,-.123);a[c](0,-.183);a[c](0,-.183);a[n]();a.fill();a[u]();a.moveTo(-.002,-.332);a[b](-.184,-.332,-.35,-.222,-.425,-.053);a[b](-.45,.005,-.464,.071,-.464,.144);a[b](-.464,.226,-.45,.304,-.423,.384);a[b](-.417,.4,-.401,.407,-.386,.402);a[b](-.371,.397,-.365,.379,-.369,.363);a[b](-.404,.266,-.407,.191,-.407,.144);a[b](-.407,.081,-.395,.023,-.374,-.026);a[b](-.308,-.175,-.162,-.271,-.002,-.271);a[b](-.001,
-.271,-.001,-.271,0,-.271);a[c](0,-.332);a[b](-.001,-.332,-.001,-.332,-.002,-.332);a[n]();a.fill();a[u]();a.moveTo(-.031,.144);a[b](-.031,.194,-.02,.242,0,.286);a[c](0,.114);a[b](-.001,.114,-.002,.114,-.003,.114);a[b](-.019,.114,-.031,.127,-.031,.144);a[n]();a.fill();a[u]();a.moveTo(-.014,.418);a[b](-.081,.345,-.119,.247,-.119,.144);a[b](-.119,.079,-.066,.026,-.002,.026);a[b](-.001,.026,-.001,.026,0,.026);a[c](0,-.035);a[c](-.001,-.035);a[b](-.098,-.035,-.175,.045,-.175,.144);a[b](-.175,.264,-.132,
.376,-.053,.46);a[b](-.035,.48,-.018,.495,0,.51);a[c](0,.432);a[b](-.005,.427,-.009,.423,-.014,.418);a[n]();a.fill();a.restore();a.restore();a.save();a.fillStyle="#FFFFFF";a[u]();a.moveTo(.004,.701);a[b](.004,.704,.002,.706,-.001,.706);a[c](-.001,.706);a[b](-.003,.706,-.006,.704,-.006,.701);a[c](-.006,-.734);a[b](-.006,-.737,-.003,-.739,-.001,-.739);a[c](-.001,-.739);a[b](.002,-.739,.004,-.737,.004,-.734);a[c](.004,.701);a[n]();a.fill();a.restore();break;case 2:t();break;case 3:t(),a.restore(),a.save(),
a.translate(0,.24),a.scale(.1,.1),J(a,0),d()}a.restore()}function G(a){function b(a){function b(a,b){if(0>a||a>=h||0>b||b>=h)return 1;if(3==l){var c=(h-1)/2,e=a-c,c=b-c;if(e*e+c*c<=d)return 1}return!x.isDark(a,b)}a=N(f,Math.abs(m),a);for(var d=v/f,d=d*d,c=-1;c<=h;c++)for(var e=-1;e<=h;e++){var p=8*b(e,c)+4*b(e+1,c)+2*b(e,c+1)+b(e+1,c+1);0>m&&(6<e&&6<c&&(p=15),6<e&&e<h-8&&(p=15),6<c&&c<h-8&&(p=15));g.drawImage(a[p],(e+.5)*f,(c+.5)*f)}}var t=a.data,d=a.size||200,l=a.logo||0,m=a.r||0;a=a.symbol||0;var p=
"Byte";t==t.replace(/[^0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ \$\%\*\+\-\.\/\:]/g,"")&&(p="Alphanumeric");var e=E.createElement("canvas");e.height=e.width=d;var g=e.getContext("2d"),x=B(0,0<l?"H":"L");x.addData(t,p);x.make();var h=x.getModuleCount(),f=Math.floor(d/h),d=Math.floor((d-h*f)/2);g.save();g.translate(d,d);g.fillStyle="#000000";g.fillRect(0,0,h*f,h*f);var d=f*h/2,v=f,v=5>l?v*Math.min(Math.floor((Math.sqrt(.2*h*h)+1)/2)-.5,.5*(h-16)):7>l?.4*v*(h-1):v*Math.min(1.12*Math.sqrt(h*h*.5)-11.08,.56*
h);b("#FFFFFF");g.save();g.transform(v,0,0,v,d,d);g.save();1==l&&(g[u](),g.fillStyle="#FFFFFF",g.rect(-1,-1,2,2),g[n](),g.fill());2==l&&(g[u](),g.fillStyle="#FFFFFF",g.arc(0,0,1,0,2*Math.PI),g[n](),g.fill());0<l&&(J(g,a),O(g,a));g.restore();g.restore();if(5==l||7==l||0>m){g.save();g.transform(f,0,0,f,f/2,f/2);g.save();for(var w=0;w<h;w++)for(var k=0;k<h;k++)d=function(a,b){g.fillStyle=b;g[u]();g.arc(k,w,a,0,2*Math.PI);g[n]();g.fill()},5!=l||x.isDark(k,w)||d(.5,"rgba(255,255,255,0.5)"),7==l&&d(.2,
x.isDark(k,w)?"#000000":"#FFFFFF"),0>m&&d(.4,x.isDark(k,w)?"#000000":"#FFFFFF");g.restore();g.restore()}6==l&&b("rgba(255,255,255,0.5)");0<a&&window.location.host.toLowerCase()!=t.toLowerCase().split("/")[2]&&(g.save(),g.strokeStyle="#ff0000",g.lineWidth=f,g.moveTo(0,0),g[c](h*f,h*f),g.stroke(),g.moveTo(h*f,0),g[c](0,h*f),g.stroke(),g.restore());g.restore();return e.toDataURL("image/jpg")}B.K={"default":function(a){for(var b=[],c=0;c<a.length;c+=1)b.push(a.charCodeAt(c)&255);return b}};B.J=B.K["default"];
var D={L:1,M:0,Q:3,H:2},z=function(){function a(a){for(var b=0;0!=a;)b+=1,a>>>=1;return b}var b=[[],[6,18],[6,22],[6,26],[6,30],[6,34],[6,22,38],[6,24,42],[6,26,46],[6,28,50],[6,30,54],[6,32,58],[6,34,62],[6,26,46,66],[6,26,48,70],[6,26,50,74],[6,30,54,78],[6,30,56,82],[6,30,58,86],[6,34,62,90],[6,28,50,72,94],[6,26,50,74,98],[6,30,54,78,102],[6,28,54,80,106],[6,32,58,84,110],[6,30,58,86,114],[6,34,62,90,118],[6,26,50,74,98,122],[6,30,54,78,102,126],[6,26,52,78,104,130],[6,30,56,82,108,134],[6,34,
60,86,112,138],[6,30,58,86,114,142],[6,34,62,90,118,146],[6,30,54,78,102,126,150],[6,24,50,76,102,128,154],[6,28,54,80,106,132,158],[6,32,58,84,110,136,162],[6,26,54,82,110,138,166],[6,30,58,86,114,142,170]],c={w:function(b){for(var d=b<<10;0<=a(d)-a(1335);)d^=1335<<a(d)-a(1335);return(b<<10|d)^21522},A:function(b){for(var d=b<<12;0<=a(d)-a(7973);)d^=7973<<a(d)-a(7973);return b<<12|d},G:function(a){return b[a-1]},F:function(a){switch(a){case 0:return function(a,b){return 0==(a+b)%2};case 1:return function(a){return 0==
a%2};case 2:return function(a,b){return 0==b%3};case 3:return function(a,b){return 0==(a+b)%3};case 4:return function(a,b){return 0==(Math.floor(a/2)+Math.floor(b/3))%2};case 5:return function(a,b){return 0==a*b%2+a*b%3};case 6:return function(a,b){return 0==(a*b%2+a*b%3)%2};case 7:return function(a,b){return 0==(a*b%3+(a+b)%2)%2};default:throw"bad maskPattern:"+a;}},C:function(a){for(var b=C([1],0),d=0;d<a;d+=1)b=b.multiply(C([1,A.j(d)],0));return b},c:function(a,b){if(1<=b&&10>b)switch(a){case 1:return 10;
case 2:return 9;case 4:return 8;case 8:return 8;default:throw"mode:"+a;}else if(27>b)switch(a){case 1:return 12;case 2:return 11;case 4:return 16;case 8:return 10;default:throw"mode:"+a;}else if(41>b)switch(a){case 1:return 14;case 2:return 13;case 4:return 16;case 8:return 12;default:throw"mode:"+a;}else throw"type:"+b;},D:function(a){for(var b=a.l(),d=0,c=0;c<b;c+=1)for(var e=0;e<b;e+=1){for(var g=0,t=a.a(c,e),h=-1;1>=h;h+=1)if(!(0>c+h||b<=c+h))for(var f=-1;1>=f;f+=1)0>e+f||b<=e+f||0==h&&0==f||
t!=a.a(c+h,e+f)||(g+=1);5<g&&(d+=3+g-5)}for(c=0;c<b-1;c+=1)for(e=0;e<b-1;e+=1)if(g=0,a.a(c,e)&&(g+=1),a.a(c+1,e)&&(g+=1),a.a(c,e+1)&&(g+=1),a.a(c+1,e+1)&&(g+=1),0==g||4==g)d+=3;for(c=0;c<b;c+=1)for(e=0;e<b-6;e+=1)a.a(c,e)&&!a.a(c,e+1)&&a.a(c,e+2)&&a.a(c,e+3)&&a.a(c,e+4)&&!a.a(c,e+5)&&a.a(c,e+6)&&(d+=40);for(e=0;e<b;e+=1)for(c=0;c<b-6;c+=1)a.a(c,e)&&!a.a(c+1,e)&&a.a(c+2,e)&&a.a(c+3,e)&&a.a(c+4,e)&&!a.a(c+5,e)&&a.a(c+6,e)&&(d+=40);for(e=g=0;e<b;e+=1)for(c=0;c<b;c+=1)a.a(c,e)&&(g+=1);return d+=Math.abs(100*
g/b/b-50)/5*10}};return c}(),A=function(){for(var a=Array(256),b=Array(256),c=0;8>c;c+=1)a[c]=1<<c;for(c=8;256>c;c+=1)a[c]=a[c-4]^a[c-5]^a[c-6]^a[c-8];for(c=0;255>c;c+=1)b[a[c]]=c;return{h:function(a){if(1>a)throw"glog("+a+")";return b[a]},j:function(b){for(;0>b;)b+=255;for(;256<=b;)b-=255;return a[b]}}}(),I=function(){function a(a,c){switch(c){case D.L:return b[4*(a-1)+0];case D.M:return b[4*(a-1)+1];case D.Q:return b[4*(a-1)+2];case D.H:return b[4*(a-1)+3];default:return K}}var b=[[1,26,19],[1,
26,16],[1,26,13],[1,26,9],[1,44,34],[1,44,28],[1,44,22],[1,44,16],[1,70,55],[1,70,44],[2,35,17],[2,35,13],[1,100,80],[2,50,32],[2,50,24],[4,25,9],[1,134,108],[2,67,43],[2,33,15,2,34,16],[2,33,11,2,34,12],[2,86,68],[4,43,27],[4,43,19],[4,43,15],[2,98,78],[4,49,31],[2,32,14,4,33,15],[4,39,13,1,40,14],[2,121,97],[2,60,38,2,61,39],[4,40,18,2,41,19],[4,40,14,2,41,15],[2,146,116],[3,58,36,2,59,37],[4,36,16,4,37,17],[4,36,12,4,37,13],[2,86,68,2,87,69],[4,69,43,1,70,44],[6,43,19,2,44,20],[6,43,15,2,44,16],
[4,101,81],[1,80,50,4,81,51],[4,50,22,4,51,23],[3,36,12,8,37,13],[2,116,92,2,117,93],[6,58,36,2,59,37],[4,46,20,6,47,21],[7,42,14,4,43,15],[4,133,107],[8,59,37,1,60,38],[8,44,20,4,45,21],[12,33,11,4,34,12],[3,145,115,1,146,116],[4,64,40,5,65,41],[11,36,16,5,37,17],[11,36,12,5,37,13],[5,109,87,1,110,88],[5,65,41,5,66,42],[5,54,24,7,55,25],[11,36,12,7,37,13],[5,122,98,1,123,99],[7,73,45,3,74,46],[15,43,19,2,44,20],[3,45,15,13,46,16],[1,135,107,5,136,108],[10,74,46,1,75,47],[1,50,22,15,51,23],[2,42,
14,17,43,15],[5,150,120,1,151,121],[9,69,43,4,70,44],[17,50,22,1,51,23],[2,42,14,19,43,15],[3,141,113,4,142,114],[3,70,44,11,71,45],[17,47,21,4,48,22],[9,39,13,16,40,14],[3,135,107,5,136,108],[3,67,41,13,68,42],[15,54,24,5,55,25],[15,43,15,10,44,16],[4,144,116,4,145,117],[17,68,42],[17,50,22,6,51,23],[19,46,16,6,47,17],[2,139,111,7,140,112],[17,74,46],[7,54,24,16,55,25],[34,37,13],[4,151,121,5,152,122],[4,75,47,14,76,48],[11,54,24,14,55,25],[16,45,15,14,46,16],[6,147,117,4,148,118],[6,73,45,14,74,
46],[11,54,24,16,55,25],[30,46,16,2,47,17],[8,132,106,4,133,107],[8,75,47,13,76,48],[7,54,24,22,55,25],[22,45,15,13,46,16],[10,142,114,2,143,115],[19,74,46,4,75,47],[28,50,22,6,51,23],[33,46,16,4,47,17],[8,152,122,4,153,123],[22,73,45,3,74,46],[8,53,23,26,54,24],[12,45,15,28,46,16],[3,147,117,10,148,118],[3,73,45,23,74,46],[4,54,24,31,55,25],[11,45,15,31,46,16],[7,146,116,7,147,117],[21,73,45,7,74,46],[1,53,23,37,54,24],[19,45,15,26,46,16],[5,145,115,10,146,116],[19,75,47,10,76,48],[15,54,24,25,55,
25],[23,45,15,25,46,16],[13,145,115,3,146,116],[2,74,46,29,75,47],[42,54,24,1,55,25],[23,45,15,28,46,16],[17,145,115],[10,74,46,23,75,47],[10,54,24,35,55,25],[19,45,15,35,46,16],[17,145,115,1,146,116],[14,74,46,21,75,47],[29,54,24,19,55,25],[11,45,15,46,46,16],[13,145,115,6,146,116],[14,74,46,23,75,47],[44,54,24,7,55,25],[59,46,16,1,47,17],[12,151,121,7,152,122],[12,75,47,26,76,48],[39,54,24,14,55,25],[22,45,15,41,46,16],[6,151,121,14,152,122],[6,75,47,34,76,48],[46,54,24,10,55,25],[2,45,15,64,46,
16],[17,152,122,4,153,123],[29,74,46,14,75,47],[49,54,24,10,55,25],[24,45,15,46,46,16],[4,152,122,18,153,123],[13,74,46,32,75,47],[48,54,24,14,55,25],[42,45,15,32,46,16],[20,147,117,4,148,118],[40,75,47,7,76,48],[43,54,24,22,55,25],[10,45,15,67,46,16],[19,148,118,6,149,119],[18,75,47,31,76,48],[34,54,24,34,55,25],[20,45,15,61,46,16]],c={m:function(b,c){var d=a(b,c);if("undefined"==typeof d)throw"bad rs block @ typeNumber:"+b+"/errorCorrectionLevel:"+c;for(var l=d.length/3,e=[],g=0;g<l;g+=1)for(var t=
d[3*g+0],h=d[3*g+1],f=d[3*g+2],n=0;n<t;n+=1){var u=f,k={};k.u=h;k.i=u;e.push(k)}return e}};return c}(),b="bezierCurveTo",c="lineTo",u="beginPath",n="closePath";F();window.DigiQR={request:function(a,b,c,d,l){return w("digibyte:"+a+(0==b?0:"?amount="+b.toFixed(8)),c,d,l)},address:w,explorer:function(a,b,c,d){return w("https://digiexplorer.info/address/"+a,b,c,d)},text:w,gen:G,id:function(a,b,c,d){return w(a,b,c,d,1)},antum:function(a,b,c,d){return w(a,b,c,d,2)},openantum:function(a,b,c,d){return w(a,
b,c,d,3)},auto:F}})(document);
})();
