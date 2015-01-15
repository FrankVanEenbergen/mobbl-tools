/*
 __COMMENT_HEADING__
 */


#import "__CLASS_PREFIX__ApplicationController.h"
#import "__CLASS_PREFIX__ApplicationFactory.h"

@implementation __CLASS_PREFIX__ApplicationController


@synthesize window = _window;

-(void) startController {
	
	@autoreleasepool {
        // registers a factory that creates custom ViewControllers and Custom Actions
        __CLASS_PREFIX__ApplicationFactory *customApplicationFactory = [[__CLASS_PREFIX__ApplicationFactory alloc] init];
        [MBApplicationFactory setSharedInstance:customApplicationFactory];
        
        [self performSelectorOnMainThread:@selector(startApplication:) withObject:customApplicationFactory waitUntilDone:YES];
        
    }
    
}

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
    [self startController];
    
    return YES;
}

- (void)dealloc
{
    [_window release];
    [super dealloc];
}

@end
