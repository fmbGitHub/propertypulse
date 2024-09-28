import connectDB from '@/config/database';
import User from '@/models/User';
import { getSessionUser } from '@/utils/getSessionUser';

export const dynamic = 'force-dynamic';

export const POST = async (request) => {
  try {
    await connectDB();

    const { propertyId } = await request.json();
    // console.log('property from route.js ', propertyId);

    const sessionUser = await getSessionUser();
    // console.log('sessionUser ', sessionUser);

    if (!sessionUser || !sessionUser.userId) {
      // console.log('inside if of sessionuser');
      return new Response('User ID is required', { status: 401 });
    }

    const { userId } = sessionUser;
    // console.log('userId => ', userId);

    // Find user in the database
    const user = await User.findOne({ _id: userId });
    // console.log('user ', user);

    // Check if property is bookmarked
    let isBookmarked = user.bookmarks.includes(propertyId);

    return new Response(JSON.stringify({ isBookmarked }), {
      status: 200,
    });
  } catch (error) {
    console.log(error);

    return new Response('Something went wrong', { status: 500 });
  }
};
