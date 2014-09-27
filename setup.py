from setuptools import setup, find_packages
from pip.req import parse_requirements

requirements = []
dependencies = []


for requirement in parse_requirements('requirements.txt'):
    if requirement.url:
        url = str(requirement.url)
        egg = url.split('#egg=')[-1]
        if '#egg=' in url and '.' in egg:
            version = egg.split('-')[-1]
            requirements.append(str(requirement.req) + '==' + version)
        dependencies.append(url)
    else:
        requirements.append(str(requirement.req))


setup(
    name="external-frontend",
    author="Ludwig Kraatz",
    author_email="code@suncircle.de",
    version='0.1.23',
    packages=find_packages(),
    package_data={'external_frontend': ['external_frontend/frontends']},
    include_package_data=True,
    install_requires=requirements,
    dependency_links=dependencies
)
