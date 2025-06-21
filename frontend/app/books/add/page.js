import BookForm from '../../../components/BookForm';
import Header from '../../../components/Header';

export default function AddBook() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="container mx-auto py-8 px-4 flex-grow flex flex-col items-center">
        <BookForm />
      </main>
    </div>
  );
}
