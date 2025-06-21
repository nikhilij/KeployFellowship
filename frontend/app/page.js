import BookList from '../components/BookList';
import Header from '../components/Header';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="container mx-auto py-8 px-4 flex-grow flex flex-col items-center">
        <BookList />
      </main>
    </div>
  );
}
