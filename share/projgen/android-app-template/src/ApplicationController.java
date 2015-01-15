/* 
__COMMENT_HEADING__
 */

package __BUNDLE_IDENTIFIER__;

import com.itude.mobile.mobbl.core.controller.MBApplicationController;
import com.itude.mobile.mobbl.core.services.MBMetadataService;

public class ApplicationController extends MBApplicationController {
	
	@Override
	public void startController() {
		MBMetadataService.setEndpointsName("config/endpoints.xml");
		MBMetadataService.setConfigName("config/config.xml");
		
		startApplication(ApplicationFactory.getInstance());
	}
}
