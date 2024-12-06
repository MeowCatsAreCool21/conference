export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "conference/_app",
	assets: new Set([".nojekyll","favicon.png"]),
	mimeTypes: {".png":"image/png"},
	_: {
		client: {"start":"_app/immutable/entry/start.D1NkRELo.js","app":"_app/immutable/entry/app.CdIGFqc_.js","imports":["_app/immutable/entry/start.D1NkRELo.js","_app/immutable/chunks/entry.CDNK2QWT.js","_app/immutable/chunks/scheduler.W2pu3yam.js","_app/immutable/entry/app.CdIGFqc_.js","_app/immutable/chunks/scheduler.W2pu3yam.js","_app/immutable/chunks/index.DKgKwfa6.js"],"stylesheets":[],"fonts":[],"uses_env_dynamic_public":false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js'))
		],
		routes: [
			
		],
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
