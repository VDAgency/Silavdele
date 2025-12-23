import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="w-full py-8 border-t mt-10">
      <div className="container mx-auto flex flex-col md:flex-row justify-between gap-6 text-sm text-gray-600">

        {/* Левый блок — копирайт */}
        <div className="text-center md:text-left">
          <p>© {new Date().getFullYear()} Silavdele. Все права защищены.</p>
        </div>

        {/* Центральный блок — ссылки */}
        <div className="flex justify-center gap-6">
          <Link to="/privacy" className="hover:text-black transition">
            Политика конфиденциальности
          </Link>
          <Link to="/offer" className="hover:text-black transition">
            Публичная оферта
          </Link>
        </div>

        {/* Правый блок — данные исполнителя */}
        <div className="text-center md:text-right leading-relaxed">
          <p>ИП Силантьев Сергей Александрович</p>
          <p>ИНН: 250816422607</p>
          <p>Email: <a href="mailto:silavdele@mail.ru" className="hover:text-black transition">silavdele@mail.ru</a></p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;

