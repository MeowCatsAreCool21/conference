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
		client: {"start":"_app/immutable/entry/start.VqXAkYk0.js","app":"_app/immutable/entry/app.DBUzL-Bm.js","imports":["_app/immutable/entry/start.VqXAkYk0.js","_app/immutable/chunks/entry.DxNZ9YdC.js","_app/immutable/chunks/scheduler.W2pu3yam.js","_app/immutable/entry/app.DBUzL-Bm.js","_app/immutable/chunks/scheduler.W2pu3yam.js","_app/immutable/chunks/index.DKgKwfa6.js"],"stylesheets":[],"fonts":[],"uses_env_dynamic_public":false},
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