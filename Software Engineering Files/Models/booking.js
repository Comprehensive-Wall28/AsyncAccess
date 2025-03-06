const bookingSchema = new mongoose.Schema({
  user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
  },
  event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
  },
  numberOfTickets: {
      type: Number,
      required: true,
    }
  });
