import connectDB from '@/config/database';
import User from '@/models/User';
import Property from '@/models/Property';
import { getSessionUser } from '@/utils/getSessionUser';

export const dynamic = 'force-dynamic';

// GET /api/bookmarks/
export const GET = async () => {
  try {
    connectDB();

    const sessionUser = await getSessionUser();
    // console.log('sessionUser ', sessionUser);

    if (!sessionUser || !sessionUser.userId) {
      // console.log('inside if of sessionuser');
      return new Response('User ID is required', { status: 401 });
    }

    const { userId } = sessionUser;

    // Find user in the database
    const user = await User.findOne({ _id: userId });
    // console.log('user ', user);

    // Get users bookmarks
    const bookmarks = await Property.find({ _id: { $in: user.bookmarks } });

    return new Response(JSON.stringify(bookmarks), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response('Something went wrong', { status: 500 });
  }
};

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

    let message;

    if (isBookmarked) {
      // If already bookmarked, remove it
      user.bookmarks.pull(propertyId);
      message = 'Bookmark removed successfully';
      isBookmarked = false;
    } else {
      // If not bookmarked, add it
      user.bookmarks.push(propertyId);
      message = 'Bookmark added successfully';
      isBookmarked = true;
    }

    await user.save();

    return new Response(JSON.stringify({ message, isBookmarked }), {
      status: 200,
    });
  } catch (error) {
    console.log(error);

    return new Response('Something went wrong', { status: 500 });
  }
};
