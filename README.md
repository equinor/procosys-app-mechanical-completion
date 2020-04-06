# ProCoSys Mechanical Completion App

## Install
```bash
yarn install
```

Change `ios/MCProCoSys/AppCenter-Config.plis` to match your AppCenter GUID

Change `android/app/src/main/assets/AppCenter-Config.json` to match your AppCenter GUID

Make Git forget about the changes: 
```bash
git update-index --assume-unchanged ios/McProCoSys/AppCenter-Config.plist
git update-index --assume-unchanged android/app/src/main/assets/appcenter-config.json
```


## RUN
```bash
npx react-native run-ios
```
OR
```bash
npx react-native run-android
```

## Compatibility problems with support libraries? 
```bash
npx jettify
```

## Visual Studio Code Extensions

- ESLint
- Prettier - Code formatter
- React Native Tools
- Document This

## Bump Version

https://www.npmjs.com/package/react-native-version-up

`yarn version:up --major / --minor // --patch`


