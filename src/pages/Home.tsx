import AddNewsBanner from '../components/forms/AddNewsBanner';
import NewsBannerHandler from '../components/NewsBannerHandler';
import RichEditor from '../components/RichEditor';
import '../styles/pages/home.scss';

const Home = () => {
  return (
    <main className="home">
      <section className="column">
        <p className="column-title">Ajouter une actualité</p>
        <AddNewsBanner />
        <hr />
        <p className="column-title">Liste des actualités</p>
        <NewsBannerHandler />
      </section>
      <section className="column">
        <p className="column-title">Ajouter un changelog</p>
      </section>
      <section className="column">
        <p className="column-title">Ajouter une ressource</p>
        {/* Future implementation of rich text editor */}
        <RichEditor />
      </section>
    </main>
  );
};

export default Home;
