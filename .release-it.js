module.exports = {
	$schema: "https://unpkg.com/release-it@19.0.1/schema/release-it.json",
	git: {
		commitMessage: "chore: release ${version}",
		tagName: "v${version}",
	},
	npm: {
		publish: true,
	},
	github: {
		release: true,
	},
	plugins: {
		"@release-it/conventional-changelog": {
			preset: "angular",
		},
	},
};
