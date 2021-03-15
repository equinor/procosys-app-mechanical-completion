#ifdef __OBJC__
#import <UIKit/UIKit.h>
#else
#ifndef FOUNDATION_EXPORT
#if defined(__cplusplus)
#define FOUNDATION_EXPORT extern "C"
#else
#define FOUNDATION_EXPORT extern
#endif
#endif
#endif

#import "AppCenterReactNativeCrashes.h"
#import "AppCenterReactNativeCrashesDelegate.h"
#import "AppCenterReactNativeCrashesUtils.h"

FOUNDATION_EXPORT double appcenter_crashesVersionNumber;
FOUNDATION_EXPORT const unsigned char appcenter_crashesVersionString[];

