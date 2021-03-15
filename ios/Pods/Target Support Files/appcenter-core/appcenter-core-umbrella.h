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

#import "AppCenterReactNative.h"

FOUNDATION_EXPORT double appcenter_coreVersionNumber;
FOUNDATION_EXPORT const unsigned char appcenter_coreVersionString[];

