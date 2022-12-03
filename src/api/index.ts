import { Router } from 'express';
import auth from '@/api/routes/auth';
import test from '@/api/routes/test';

// guaranteed to get dependencies
export default (): Router => {
	const app: Router = Router();

	auth(app);
	test(app);
	
	return app;
}